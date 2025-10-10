import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

const getAllPatients = async (req, res) => {
  console.log("getAllPatients");
};

const createPatient = async (req, res) => {
  console.log("createPatient");
};

/*
 * login de un usuario
 * POST /api/patients/login
 */
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const patient = await prisma.patient.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    const doctor = await prisma.doctor.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    const clinic = await prisma.clinic.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!patient && !doctor && !clinic) {
     
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (!patient && !doctor) {
      return res.status(200).json({ rol: "clinic", usuario: clinic });
    }

    if (!patient && doctor) {
      return res.status(200).json({ rol: "doctor", usuario: doctor });
    }

    if (patient.role !== "Patient") {
      return res.status(200).json({ rol: "admin", usuario: patient });
    }

    return res.status(200).json({ rol: "paciente", usuario: patient });
  } catch (error) {
    console.error("Tienes este error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const PatientsController = { getAllPatients, createPatient, loginPatient };
export default PatientsController;
