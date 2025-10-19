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

const getAllAppointmentsByDoctorByDay = async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const date = req.params.date;

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
        start_time: {
          // <-- Cambiar de date a start_time
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        patient: true, // Incluir información del paciente
      },
      orderBy: {
        start_time: "asc", // Ordenar por hora de inicio
      },
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const DoctorsController = { createDoctor, doctorById, getAllAppointmentsByDoctorByDay };

export default DoctorsController;
