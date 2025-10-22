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

// Cancelar una cita
const cancelAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);

  console.log("=== CANCEL APPOINTMENT ===");
  console.log("Appointment ID:", appointmentId);

  try {
    // Verificar que la cita existe
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // No permitir cancelar si ya está cancelada
    if (appointment.status === "cancelled") {
      return res.status(400).json({ error: "Appointment is already cancelled" });
    }

    // Cancelar la cita
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "cancelled" },
      include: {
        patient: {
          select: { id: true, name_given: true, name_family: true, email: true },
        },
        doctor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    console.log("Appointment cancelled successfully");
    return res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment: updated,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener detalles completos de una cita específica
const getAppointmentDetails = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);

  console.log("=== GET APPOINTMENT DETAILS ===");
  console.log("Appointment ID:", appointmentId);

  try {
    // Obtener la cita con detalles del paciente y doctor
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            name_given: true,
            name_family: true,
            email: true,
            gender: true,
            birth_date: true,
            address: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialty: true,
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Obtener observaciones del paciente (todas sus observaciones)
    const observations = await prisma.observation.findMany({
      where: { patient_id: appointment.patient_id },
      orderBy: { created_at: "desc" },
    });

    // Obtener últimas 5 citas del paciente (excluyendo esta)
    const previousAppointments = await prisma.appointment.findMany({
      where: {
        patient_id: appointment.patient_id,
        id: { not: appointmentId },
      },
      include: {
        doctor: {
          select: { id: true, name: true },
        },
      },
      orderBy: { start_time: "desc" },
      take: 5,
    });

    // Formatear fechas
    const formattedAppointment = {
      ...appointment,
      start_time: new Date(appointment.start_time).toLocaleString("es-ES"),
      end_time: new Date(appointment.end_time).toLocaleString("es-ES"),
    };

    res.status(200).json({
      data: {
        id: appointment.id,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        status: appointment.status,
        service_type: appointment.service_type,
        description: appointment.description,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        createdAt: appointment.created_at,
        patient: {
          id: appointment.patient.id,
          name: `${appointment.patient.name_given} ${appointment.patient.name_family}`,
          email: appointment.patient.email,
          phone: appointment.patient.address || "",
          date_of_birth: appointment.patient.birth_date,
        },
        doctor: {
          id: appointment.doctor.id,
          name: appointment.doctor.name,
          speciality: appointment.doctor.specialty,
        },
        observations: observations.map((obs) => ({
          id: obs.identifier || obs.id.toString(),
          category: obs.category,
          code: obs.code,
          value_string: obs.value_string,
          value_unit: obs.value_unit,
          notes: obs.code_display,
          status: obs.status,
          createdAt: obs.created_at,
        })),
        previousAppointments: previousAppointments.map((apt) => ({
          id: apt.id,
          start_time: apt.start_time,
          end_time: apt.end_time,
          status: apt.status,
          service_type: apt.service_type,
          description: apt.description,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Actualizar estado de la cita
const updateAppointmentStatus = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);
  const { status } = req.body;

  console.log("=== UPDATE APPOINTMENT STATUS ===");
  console.log("Appointment ID:", appointmentId, "New status:", status);

  try {
    const validStatuses = [
      "pending",
      "confirmed",
      "booked",
      "arrived",
      "fulfilled",
      "cancelled",
      "noshow",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: status },
      include: {
        patient: {
          select: { name_given: true, name_family: true },
        },
      },
    });

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment: updated,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Agregar observación a una cita
const addObservationToAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);
  const doctorId = parseInt(req.params.id);
  const { category, code, value_string, value_unit, notes } = req.body;

  console.log("=== ADD OBSERVATION ===");
  console.log("Appointment ID:", appointmentId, "Doctor ID:", doctorId);

  try {
    // Verificar que la cita existe
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Crear observación
    const observation = await prisma.observation.create({
      data: {
        identifier: uuidv4(),
        status: "registered",
        category: category || "general",
        code: code || "",
        code_display: notes || code || "",
        effective_datetime: new Date(),
        issued_datetime: new Date(),
        value_string: value_string || "",
        value_unit: value_unit || "",
        patient_id: appointment.patient_id,
        doctor_id: doctorId,
      },
    });

    res.status(201).json({
      message: "Observation added successfully",
      observation: observation,
    });
  } catch (error) {
    console.error("Error adding observation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Agregar prescripción a una cita
const addPrescriptionToAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);
  const doctorId = parseInt(req.params.id);
  const { medication, dose, frequency, duration, instructions } = req.body;

  console.log("=== ADD PRESCRIPTION ===");
  console.log("Appointment ID:", appointmentId, "Doctor ID:", doctorId);

  try {
    // Verificar que la cita existe
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Validar campos requeridos
    if (!medication || !dose || !frequency || !duration) {
      return res.status(400).json({
        error: "Missing required fields: medication, dose, frequency, duration",
      });
    }

    // Crear prescripción
    const prescription = await prisma.prescription.create({
      data: {
        identifier: uuidv4(),
        medication,
        dose,
        frequency,
        duration,
        instructions: instructions || "",
        status: "active",
        appointment_id: appointmentId,
        patient_id: appointment.patient_id,
        doctor_id: doctorId,
      },
    });

    res.status(201).json({
      message: "Prescription added successfully",
      prescription: prescription,
    });
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener prescripciones de una cita
const getPrescriptionsForAppointment = async (req, res) => {
  const appointmentId = parseInt(req.params.appointmentId);

  console.log("=== GET PRESCRIPTIONS ===");
  console.log("Appointment ID:", appointmentId);

  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { appointment_id: appointmentId },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json({
      prescriptions: prescriptions,
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Buscar pacientes del doctor (para búsqueda)
const searchPatients = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { search } = req.query;

  console.log("=== SEARCH PATIENTS ===");
  console.log("Doctor ID:", doctorId, "Search:", search);

  try {
    if (!search || search.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Buscar pacientes que hayan tenido citas con este doctor
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { name_given: { contains: search, mode: "insensitive" } },
          { name_family: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
        appointments: {
          some: { doctor_id: doctorId },
        },
      },
      select: {
        id: true,
        name_given: true,
        name_family: true,
        email: true,
        birth_date: true,
      },
      take: 10,
    });

    res.status(200).json({
      patients: patients,
    });
  } catch (error) {
    console.error("Error searching patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener estadísticas del doctor
const getDoctorStatistics = async (req, res) => {
  const doctorId = parseInt(req.params.id);

  console.log("=== GET DOCTOR STATISTICS ===");
  console.log("Doctor ID:", doctorId);

  try {
    // Citas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
        start_time: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const completedToday = appointmentsToday.filter(
      (apt) => apt.status === "completed" || apt.status === "fulfilled"
    ).length;
    const pendingToday = appointmentsToday.filter(
      (apt) => apt.status === "pending" || apt.status === "booked"
    ).length;
    const cancelledToday = appointmentsToday.filter((apt) => apt.status === "cancelled").length;

    // Citas totales (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const appointmentsMonth = await prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
        start_time: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Pacientes únicos (últimos 30 días)
    const uniquePatients = new Set(appointmentsMonth.map((apt) => apt.patient_id));

    res.status(200).json({
      statistics: {
        today: {
          total: appointmentsToday.length,
          completed: completedToday,
          pending: pendingToday,
          cancelled: cancelledToday,
        },
        lastMonth: {
          total: appointmentsMonth.length,
          uniquePatients: uniquePatients.size,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  cancelAppointment,
  getAppointmentDetails,
  updateAppointmentStatus,
  addObservationToAppointment,
  addPrescriptionToAppointment,
  getPrescriptionsForAppointment,
  searchPatients,
  getDoctorStatistics,
};

export default DoctorsController;
