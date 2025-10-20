import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
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
    // Crear rangos de fecha
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    // Condición base de búsqueda
    const whereClause = {
      doctor_id: doctorId,
      start_time: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    // Contar total de citas para esta fecha
    const totalAppointments = await prisma.appointment.count({
      where: whereClause,
    });

    // Obtener citas con paginación
    const appointments = await prisma.appointment.findMany({
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
      skip: skip,
      take: limit,
    });

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

// ...existing code...

const DoctorsController = {
  createDoctor,
  doctorById,
  getAllAppointmentsByDoctorByDay,
  updateAppointmentTime,
};

export default DoctorsController;
