import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

/*
 * crear usuarios doctores
 * POST /api/doctors/
 */
const createDoctor = async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;
    const {
      identifier,
      email,
      password,
      name_family,
      name_given,
      gender,
      birth_date,
      address,
      marital_status,
    } = req.body;

    if (!email || !password || !name_given) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const newPatient = await prisma.patient.create({
      data: {
        identifier: identifier || null,
        email: email,
        password: passwordHash,
        role: "Patient",
        active: true,
        // Datos opcionales
        name_family: name_family || null,
        name_given: name_given,
        gender: gender || null,
        birth_date: null,
        address: address || null,
        marital_status: marital_status || null,
      },
    });
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("You have this error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const doctorById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ...existing code...

const getAllAppointmentsByDoctorByDay = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const date = req.query.date || new Date().toISOString().split("T")[0];

  // Parámetros de paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  console.log("=== APPOINTMENTS REQUEST ===");
  console.log("Doctor ID:", doctorId);
  console.log("Date:", date);
  console.log("Page:", page, "| Limit:", limit);

  try {
    // Crear rangos de fecha más amplios para capturar en cualquier timezone
    const startOfDay = new Date(`${date}T00:00:00Z`);
    startOfDay.setUTCDate(startOfDay.getUTCDate() - 1); // Día anterior

    const endOfDay = new Date(`${date}T23:59:59Z`);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1); // Día siguiente

    // Condición base de búsqueda con rango amplio
    const whereClause = {
      doctor_id: doctorId,
      start_time: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    // Contar total de citas en el rango amplio
    const appointmentsInRange = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name_given: true,
            name_family: true,
            email: true,
          },
        },
      },
      orderBy: {
        start_time: "asc",
      },
    });

    // Filtrar para solo la fecha solicitada (por día calendario)
    const appointmentsForDate = appointmentsInRange.filter((apt) => {
      const aptDate = new Date(apt.start_time).toISOString().split("T")[0];
      return aptDate === date;
    });

    // Aplicar paginación
    const appointments = appointmentsForDate.slice(skip, skip + limit);
    const totalAppointments = appointmentsForDate.length;

    // Calcular metadata de paginación
    const totalPages = Math.ceil(totalAppointments / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    console.log(`Found ${appointments.length} of ${totalAppointments} appointments`);

    res.status(200).json({
      data: appointments,
      pagination: {
        total: totalAppointments,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Actualizar fecha y hora de una cita
const updateAppointmentTime = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);
  const { start_time, end_time } = req.body;

  console.log("=== UPDATE APPOINTMENT ===");
  console.log("Appointment ID:", appointmentId);
  console.log("New start_time:", start_time);
  console.log("New end_time:", end_time);

  try {
    // Validar que la cita existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Validar fechas
    const newStartTime = new Date(start_time);
    const newEndTime = new Date(end_time);

    if (newStartTime >= newEndTime) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    // Comprobar conflictos: otras citas del mismo doctor que se solapen
    const overlapping = await prisma.appointment.findFirst({
      where: {
        doctor_id: existingAppointment.doctor_id,
        id: { not: appointmentId },
        // Estados que bloquean el horario (todo excepto canceladas o no presentadas)
        status: { notIn: ["cancelled", "noshow"] },
        // Solape: start < newEnd AND end > newStart
        start_time: { lt: newEndTime },
        end_time: { gt: newStartTime },
      },
      select: { id: true, start_time: true, end_time: true, status: true },
    });

    if (overlapping) {
      return res.status(409).json({
        error: "Time slot already booked",
        conflict: overlapping,
      });
    }

    // Actualizar la cita
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        start_time: newStartTime,
        end_time: newEndTime,
      },
      include: {
        patient: {
          select: {
            id: true,
            name_given: true,
            name_family: true,
            email: true,
          },
        },
      },
    });

    console.log("Appointment updated successfully");
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener slots disponibles y ocupados de un doctor para una fecha
const getAvailableSlots = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const date = req.query.date || new Date().toISOString().split("T")[0];

  // Horario del doctor (esto podría venir de la BD en el futuro)
  const DOCTOR_START_HOUR = 8; // 8:00 AM
  const DOCTOR_END_HOUR = 14; // 2:00 PM
  const SESSION_DURATION = 15; // minutos

  console.log("=== AVAILABLE SLOTS REQUEST ===");
  console.log("Doctor ID:", doctorId);
  console.log("Date:", date);

  try {
    // DEBUG: Log all appointments for this doctor
    const allAppointments = await prisma.appointment.findMany({
      where: { doctor_id: doctorId },
      select: {
        id: true,
        start_time: true,
        end_time: true,
        status: true,
      },
    });
    console.log(
      "DEBUG: All appointments for doctor",
      doctorId,
      ":",
      allAppointments.length,
      "total"
    );

    // Verificar que el doctor existe
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Obtener todas las citas del doctor para esa fecha
    // Usar un rango más amplio para capturar citas en cualquier timezone
    // Desde inicio del día anterior en UTC hasta final del día siguiente
    const startOfDay = new Date(`${date}T00:00:00Z`);
    startOfDay.setUTCDate(startOfDay.getUTCDate() - 1); // Día anterior

    const endOfDay = new Date(`${date}T23:59:59Z`);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1); // Día siguiente

    console.log(
      "DEBUG: Querying date range - Start:",
      startOfDay.toISOString(),
      "End:",
      endOfDay.toISOString()
    );

    const appointmentsInRange = await prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
        start_time: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        start_time: true,
        end_time: true,
        status: true,
      },
    });

    // Filtrar para solo la fecha solicitada (por día calendario)
    const appointments = appointmentsInRange.filter((apt) => {
      const aptDate = new Date(apt.start_time).toISOString().split("T")[0];
      return aptDate === date;
    });

    console.log(
      "DEBUG: Filtered appointments count:",
      appointments.length,
      "appointments:",
      appointments
    );

    // Generar todos los slots posibles del día
    const allSlots = [];
    for (let hour = DOCTOR_START_HOUR; hour < DOCTOR_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SESSION_DURATION) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        allSlots.push(timeString);
      }
    }

    // Marcar slots ocupados
    const slotsWithStatus = allSlots.map((slot) => {
      const [hour, minute] = slot.split(":").map(Number);

      // Intervalo del slot [slotStart, slotEnd)
      const slotStart = new Date(`${date}T${slot}:00Z`);
      const slotEnd = new Date(slotStart.getTime() + SESSION_DURATION * 60 * 1000);

      // Buscar si hay alguna cita que se solape con el intervalo del slot
      const appointment = appointments.find((apt) => {
        const aptStart = new Date(apt.start_time);
        const aptEnd = new Date(apt.end_time);
        // Considerar ocupadas todas excepto canceladas o no presentadas
        const s = (apt.status || "").toLowerCase();
        const occupies = !["cancelled", "noshow"].includes(s);
        if (!occupies) return false;
        // Hay solape si el inicio del slot es antes del fin de la cita
        // y el fin del slot es después del inicio de la cita
        return slotStart < aptEnd && slotEnd > aptStart;
      });

      return {
        time: slot,
        available: !appointment,
        appointmentId: appointment ? appointment.id : null,
        status: appointment ? appointment.status : null,
      };
    });

    // Separar en disponibles y ocupados
    const availableSlots = slotsWithStatus.filter((s) => s.available).map((s) => s.time);
    const occupiedSlots = slotsWithStatus.filter((s) => !s.available);

    console.log(`Available: ${availableSlots.length}, Occupied: ${occupiedSlots.length}`);

    res.status(200).json({
      date: date,
      doctorId: doctorId,
      workingHours: {
        start: `${DOCTOR_START_HOUR}:00`,
        end: `${DOCTOR_END_HOUR}:00`,
        sessionDuration: SESSION_DURATION,
      },
      slots: slotsWithStatus,
      summary: {
        total: allSlots.length,
        available: availableSlots.length,
        occupied: occupiedSlots.length,
      },
      availableSlots: availableSlots,
      occupiedSlots: occupiedSlots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Endpoint de debug: listar todas las citas de un doctor
const getAllAppointmentsForDoctor = async (req, res) => {
  const doctorId = parseInt(req.params.id);

  console.log("=== LIST ALL APPOINTMENTS FOR DOCTOR ===");
  console.log("Doctor ID:", doctorId);

  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const appointments = await prisma.appointment.findMany({
      where: { doctor_id: doctorId },
      include: {
        patient: { select: { id: true, name_given: true, email: true } },
      },
      orderBy: { start_time: "asc" },
    });

    console.log("Found appointments:", appointments.length);
    return res.status(200).json({
      doctorId,
      totalCount: appointments.length,
      appointments: appointments.map((apt) => ({
        id: apt.id,
        date: new Date(apt.start_time).toISOString().split("T")[0],
        time: new Date(apt.start_time).toISOString().split("T")[1].substring(0, 5),
        status: apt.status,
        patient: apt.patient.name_given,
      })),
    });
  } catch (error) {
    console.error("Error listing appointments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Endpoint de prueba: crear citas de prueba para hoy
const createTestAppointments = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const today = new Date().toISOString().split("T")[0];

  console.log("=== CREATE TEST APPOINTMENTS ===");
  console.log("Doctor ID:", doctorId);
  console.log("Date:", today);

  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    // Crear 3 citas de prueba a diferentes horas para hoy
    const testSlots = ["09:00", "10:30", "12:00"];
    const createdAppointments = [];

    for (const slot of testSlots) {
      const [hour, minute] = slot.split(":").map(Number);
      const startTime = new Date(`${today}T${slot}:00Z`);
      const endTime = new Date(startTime.getTime() + 15 * 60 * 1000);

      const apt = await prisma.appointment.create({
        data: {
          identifier: uuidv4(),
          status: "booked",
          service_type: "test",
          start_time: startTime,
          end_time: endTime,
          description: "Test appointment",
          patient_id: 1,
          doctor_id: doctorId,
        },
        include: {
          patient: { select: { id: true, name_given: true } },
        },
      });
      createdAppointments.push(apt);
    }

    console.log("Created test appointments:", createdAppointments);
    return res
      .status(201)
      .json({ message: "Test appointments created", data: createdAppointments });
  } catch (error) {
    console.error("Error creating test appointments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Crear una nueva cita (booking) para un doctor con prevención de solapes
const createAppointment = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { patient_id, start_time, end_time, service_type, description } = req.body;

  console.log("=== CREATE APPOINTMENT ===");
  console.log("Doctor ID:", doctorId);
  console.log("Patient ID:", patient_id);
  console.log("start_time:", start_time, "end_time:", end_time);

  try {
    // Validaciones básicas
    if (!patient_id || !start_time || !end_time) {
      return res.status(400).json({ error: "patient_id, start_time and end_time are required" });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const patient = await prisma.patient.findUnique({ where: { id: Number(patient_id) } });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const newStart = new Date(start_time);
    const newEnd = new Date(end_time);
    if (!(newStart instanceof Date) || isNaN(newStart.getTime())) {
      return res.status(400).json({ error: "Invalid start_time" });
    }
    if (!(newEnd instanceof Date) || isNaN(newEnd.getTime())) {
      return res.status(400).json({ error: "Invalid end_time" });
    }
    if (newStart >= newEnd) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    // Chequear solape con otras citas del mismo doctor (bloqueantes: todas excepto canceladas/noshow)
    const overlapping = await prisma.appointment.findFirst({
      where: {
        doctor_id: doctorId,
        status: { notIn: ["cancelled", "noshow"] },
        start_time: { lt: newEnd },
        end_time: { gt: newStart },
      },
      select: { id: true, start_time: true, end_time: true, status: true },
    });

    if (overlapping) {
      return res.status(409).json({
        error: "Time slot already booked",
        conflict: overlapping,
      });
    }

    // Crear cita
    const created = await prisma.appointment.create({
      data: {
        identifier: uuidv4(),
        status: "booked",
        service_type: service_type || "general",
        start_time: newStart,
        end_time: newEnd,
        description: description || "",
        patient_id: Number(patient_id),
        doctor_id: doctorId,
      },
      include: {
        patient: {
          select: { id: true, name_given: true, name_family: true, email: true },
        },
        doctor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    console.log("Appointment created successfully", created.id);
    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const DoctorsController = {
  createDoctor,
  doctorById,
  getAllAppointmentsByDoctorByDay,
  updateAppointmentTime,
  getAvailableSlots,
  createAppointment,
  createTestAppointments,
  getAllAppointmentsForDoctor,
};

export default DoctorsController;
