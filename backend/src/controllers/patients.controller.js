import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

/*
 * login de un usuario
 * POST /api/patients/login
 */
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({ error: "Required data missing" });
    }

    const [patient, doctor, clinic] = await prisma.$transaction([
      prisma.patient.findFirst({ where: { email } }),
      prisma.doctor.findFirst({ where: { email } }),
      prisma.clinic.findFirst({ where: { email } }),
    ]);

    const user = patient || doctor || clinic;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar contraseña — asumiendo que todos los tipos tienen campo password
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Determinar rol principal y subrol (si aplica)
    let rolPrincipal;

    if (patient) {
      // Si es paciente, revisa el campo role
      rolPrincipal = "patient";
      if (patient.role && patient.role.toLowerCase() === "admin") {
        rolPrincipal = "admin";
      }
    } else if (doctor) {
      rolPrincipal = "doctor";
    } else {
      rolPrincipal = "clinic";
    }

    // Crear payload para el JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: rolPrincipal,
      // solo tendrá sentido si es paciente
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {});

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name_given || user.name,
        role: rolPrincipal,
      },
      accessToken: token,
      token_type: "Bearer",
    });
  } catch (error) {
    console.error("You have this error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 * crear usuarios pacientes
 * POST /api/patients/
 */
const createPatient = async (req, res) => {
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

// Endpoint para Google OAuth: buscar o crear usuario
// GET /api/get-or-create-user?email=...&name=...
export const getOrCreateUser = async (req, res) => {
  try {
    const { email, name } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }
    let user = await prisma.patient.findUnique({ where: { email } });
    if (!user) {
      const identifier = uuidv4();
      // Crea el usuario con datos básicos
      user = await prisma.patient.create({
        data: {
          identifier: identifier,
          email: email,
          name_given: name || email,
          role: "patient",
          active: true,
          password: null,
        },
      });
    }
    res.json({
      id: user.id,
      role: user.role,
      name: user.name_given || user.name || email,
      email: user.email,
    });
  } catch (error) {
    console.error("Error en getOrCreateUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAppointmentsByDate = async (req, res) => {
  try {
    const { idPatient } = req.params.idPatient;
    const { startDate, endDate } = req.query;

    const where = {
      patientId: idPatient,
      ...(startDate &&
        endDate && {
        created_at: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    return res.json("------>>", appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtener perfil del paciente con citas y observaciones
const getPatientProfile = async (req, res) => {
  const patientId = parseInt(req.params.id);

  console.log("=== GET PATIENT PROFILE ===");
  console.log("Patient ID:", patientId);

  try {
    // Obtener datos del paciente
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        appointments: {
          include: {
            doctor: {
              select: { id: true, name: true, specialty: true },
            },
          },
          orderBy: { start_time: "desc" },
        },
        observations: {
          include: {
            doctor: {
              select: { id: true, name: true },
            },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Estructura mejorada para el frontend
    const profileData = {
      id: patient.id,
      personalData: {
        name_given: patient.name_given,
        name_family: patient.name_family,
        email: patient.email,
        gender: patient.gender,
        birth_date: patient.birth_date,
        address: patient.address,
        marital_status: patient.marital_status,
        identifier: patient.identifier,
      },
      appointments: patient.appointments.map((apt) => ({
        id: apt.id,
        date: new Date(apt.start_time).toISOString().split("T")[0],
        time: new Date(apt.start_time).toISOString().split("T")[1].substring(0, 5),
        endTime: new Date(apt.end_time).toISOString().split("T")[1].substring(0, 5),
        status: apt.status,
        doctor: apt.doctor.name,
        service_type: apt.service_type,
        description: apt.description,
      })),
      observations: patient.observations.map((obs) => ({
        id: obs.id,
        date: new Date(obs.created_at).toISOString().split("T")[0],
        time: new Date(obs.created_at).toISOString().split("T")[1].substring(0, 5),
        category: obs.category,
        code: obs.code,
        value: obs.value_string || obs.value_quantity,
        unit: obs.value_unit,
        doctor: obs.doctor.name,
      })),
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAppointmentsByIdPatient = async (req, res) => {

  try {
    const { idPatient } = req.params.idPatient;
    const appointments = await prisma.appointment.findMany({
      where: { patientId: idPatient },
      orderBy: { created_at: "desc" },
    });
    console.log('------->', appointments);
    return res.json({ appointments });

  } catch (error) {
    console.error("Error fetching appointments by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

const editPatientProfile = async (req, res) => {
  try {
    const { idPatient } = req.params;
    const { name_given, name_family, address, phone, gender, birth_date, marital_status, language } = req.body;

    //Armar un objeto con los datos a actualizar
    const dataToUpdate = {};
    if (name_given !== undefined) dataToUpdate.name_given = name_given;
    if (name_family !== undefined) dataToUpdate.name_family = name_family;
    if (address !== undefined) dataToUpdate.address = address;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (gender !== undefined) dataToUpdate.gender = gender;
    if (birth_date !== undefined) dataToUpdate.birth_date = birth_date;
    if (marital_status !== undefined) dataToUpdate.marital_status = marital_status;
    if (language !== undefined) dataToUpdate.language = language;

    const updatedPatient = await prisma.patient.update({
      where: { id: idPatient },
      data: dataToUpdate,
    });

    res.json('UPDATE--->', updatedPatient);

  } catch (error) {
    console.error("Error editing patient profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const createNewAppointment = async (req, res) => {
  try {

    const { idPatient } = req.params;
    const { identifier,service_type, description, start_time, end_time, doctorId } = req.body;

    const newAppointment = await prisma.appointment.create({
      data: {
        identifier,
        service_type,
        description,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        doctor: { connect: { id: parseInt(doctorId) } },
        patient: { connect: { id: parseInt(idPatient) } },
      }
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating new appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const PatientsController = {
  createPatient,
  loginPatient,
  getOrCreateUser,
  getAllAppointmentsByDate,
  getAllAppointmentsByIdPatient,
  createNewAppointment,
  editPatientProfile,
  getPatientProfile,
};

export default PatientsController;
