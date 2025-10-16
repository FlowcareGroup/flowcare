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

const PatientsController = { createPatient, loginPatient, getOrCreateUser };

export default PatientsController;
