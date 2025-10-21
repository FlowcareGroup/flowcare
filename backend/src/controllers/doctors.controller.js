import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();


/*
 * Obtener todas los doctores
 * GET /api/doctors/getAllDoctors
 */
const getAllDoctors = async (req, res) => {
  try {
    const clinic=req.user.id;
    const doctors = await prisma.doctor.findMany({
        where: { clinic_id: Number(clinic)},
      select: {
        id: true,
        name: true,
        email: true,
        telf: true,
        hours: true,
        specialty: true
      },
    });
    if (doctors.length === 0) {
      return res.status(200).json({ error: "No doctors found" });
    }
    res.json(doctors);
  } catch (error) {
    console.error("You have this error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


/* Obtener doctores
 * GET /api/doctors/getDoctors/:id
 */
const getDoctorById = async (req, res) => {
  try {
const clinic=req.user.id;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Required data missing" });
    }
    const doctors = await prisma.doctor.findUnique({
      where: { id: Number(id) , clinic_id: Number(clinic)},
      select: {
        id: true,
        name: true,
        email: true,
        telf: true,
        hours: true,
        specialty: true
      },
    });
    if (!doctors) {
      return res.status(200).json({ error: "No doctors found" });
    }
    res.json(doctors);
  } catch (error) {
    console.error("You have this error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 * crear un nuevo doctor
 * POST /api/doctors/createDoctor
*/
const createDoctor = async (req, res) => {
  try {
    const clinic=req.user.id;
    const { name, email, hours, specialty,telf, password } = req.body;
    if (!name || !email || !hours ||!specialty || !telf || !password) {
      return res.status(400).json({ error: "Required data missing" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctors = await prisma.doctor.findFirst({
      where: { email: email },
    });
    if (doctors) {
      return res.status(400).json({ error: "Doctor already exists" });
    }

    const newDoctor = await prisma.doctor.create({
        data: {
            name: name,
            email: email,
            hours: hours,
            telf: telf,
            specialty: specialty,
            password: hashedPassword,
            clinic_id: Number(clinic)
        },
    });
    return res.status(200).json(newDoctor);
  } catch (error) {
    console.error("Error en createDoctor:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/*
 * editar una doctor existente
 * PUT /api/doctors/editDoctor/:id
 */
const editDoctor = async (req, res) => {
const clinic=req.user.id;
 const id = req.params.id;
   if (!id) {
     return res.status(400).json({ error: "Required data missing" });
   }
 
   const { name, email, hours, specialty, telf, password } = req.body;
   let hashedPassword;
 
   // Si se proporciona una nueva contraseña, hashearla
   if (password) {
     const salt = await bcrypt.genSalt(10);
     hashedPassword = await bcrypt.hash(password, salt);
   }
 
   // Construir el objeto de actualización solo con los campos presentes
   const updateData = {};
   if (name) updateData.name = name;
   if (email) updateData.email = email;
   if (hours) updateData.hours = hours;
   if (specialty) updateData.specialty = specialty;
   if (telf) updateData.telf = telf;
   if (hashedPassword) updateData.password = hashedPassword;
 
   // Si no hay datos para actualizar, devolver un error
   if (Object.keys(updateData).length === 0) {
     return res.status(400).json({ error: "No data provided to update" });
   }
 
   try {
     // Actualizar la clínica en la base de datos
     const updatedClinic = await prisma.doctor.update({
       where: { id: Number(id) , clinic_id: Number(clinic)},
       data: updateData,
     });
 
     res.status(200).json(updatedClinic);
   } catch (error) {
     console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
   }
 };

 /*
 * eliminar una doctor existente
 * DELETE /api/doctors/deleteDoctor/:id
 */
const deleteDoctor = async (req, res) => {
  try {
    const clinic=req.user.id;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Required data missing" });
    }

    // Consulta de borrado
    await prisma.doctor.delete({
       where: { id: Number(id), clinic_id: Number(clinic) },
    });

    
    res.status(200).send();
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: "Failed to delete the clinic." });
  }
};

 



const DoctorsController = {getAllDoctors,createDoctor,getDoctorById ,editDoctor,deleteDoctor};

export default DoctorsController;
