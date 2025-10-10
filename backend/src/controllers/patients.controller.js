import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
   //  if (!password || !email) {
   //    return res.status(400).json({ error: "Faltan datos requeridos" });
   //  }

   const [patient, doctor, clinic] = await prisma.$transaction([
      prisma.patient.findFirst({ where: { email } }),
      prisma.doctor.findFirst({ where: { email } }),
      prisma.clinic.findFirst({ where: { email } }),
    ]);


const user = patient || doctor || clinic;
  if (!user) {
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


/*
 // Verificar contraseña — asumiendo que todos los tipos tienen campo password
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Correo o contraseña inválidos" });
    }

    // Determinar rol principal y subrol (si aplica)
    let rolPrincipal;
    let esAdminPaciente = false;

    if (patient) {
      // Si es paciente, revisa el campo role
      rolPrincipal = "patient";
      if (patient.role && patient.role.toLowerCase() === "admin") {
        esAdminPaciente = true;
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
      isAdminPatient: esAdminPaciente,  // solo tendrá sentido si es paciente
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Construir usuario seguro para exponer al cliente
    const usuarioExpuesto = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: rolPrincipal,
      isAdmin: esAdminPaciente,
      // otros campos públicos si los necesitas
    };

    res.json({
      access_token: token,
      token_type: "Bearer",
      user: usuarioExpuesto,
    });

*/