import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

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

   const [patient, doctor, clinic] = await prisma.$transaction([
      prisma.patient.findFirst({ where: { email } }),
      prisma.doctor.findFirst({ where: { email } }),
      prisma.clinic.findFirst({ where: { email } }),
    ]);

const user = patient || doctor || clinic;


  if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }


// Verificar contraseña — asumiendo que todos los tipos tienen campo password
     if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Correo o contraseña inválidos" });
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

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
    });

  

    res.json({
      access_token: token,
        role: rolPrincipal,
      token_type: "Bearer",
    });

  } catch (error) {
    console.error("Tienes este error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 * crear usuarios pacientes
 * POST /api/patients/
 */
const createPatient = async (req, res) => {
    try {
        const { identifier, email, password, name_family, name_given, gender, birth_date, address, marital_status} = req.body;
        console.log(req.body);

        const newPatient = await prisma.patient.create({
            data:{
                identifier: identifier,
                email: email,
                password: password,
                name_family: name_family,
                name_given: name_given,
                gender: gender,
                birth_date: new Date(birth_date),
                address: address,
                marital_status: marital_status
            }
        });
        res.status(201).json(newPatient);
    } catch (error) {
        console.error('Tienes este error: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const PatientsController = { createPatient,loginPatient };
export default PatientsController;

