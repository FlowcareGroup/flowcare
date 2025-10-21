import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

/*
 * Obtener todas las clinicas
 * GET /api/clinics/getAllClinics
 */
const getAllClinics = async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        NIF: false,
        telf: true,
        //pongo los datos de los doctores?
        doctors: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (clinics.length === 0) {
      return res.status(200).json({ error: "No clinics found" });
    }
    res.json(clinics);
  } catch (error) {
    console.error("You have this error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
/* Obtener clinicas
 * GET /api/clinics/getClinics/:id
 */
const getClinics = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Required data missing" });
    }
    const clinics = await prisma.clinic.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        NIF: false,
        telf: true,
        //pongo los datos de los doctores?
        doctors: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!clinics) {
      return res.status(200).json({ error: "No clinics found" });
    }
    res.json(clinics);
  } catch (error) {
    console.error("You have this error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
/*
 * crear una nueva clinica
 * POST /api/clinics/createClinic
 */
const createClinic = async (req, res) => {
  try {
    const { name, email, NIF, telf, password } = req.body;
    if (!name || !email || !NIF || !telf || !password) {
      return res.status(400).json({ error: "Required data missing" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const clinics = await prisma.clinic.findFirst({
      where: { email: email, NIF: NIF },
    });
    if (clinics) {
      return res.status(400).json({ error: "Clinic already exists" });
    }

    const newClinic = await prisma.clinic.create({
      data: {
        name: name,
        email: email,
        NIF: NIF,
        telf: telf,
        password: hashedPassword,
      },
    });
    res.status(201).json(newClinic);
  } catch (error) {
    console.error("You have this error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 * editar una clinica existente
 * PUT /api/clinics/editClinic/:id
 */
const editClinic = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "Required data missing" });
  }

  const { name, email, NIF, telf, password } = req.body;
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
  if (NIF) updateData.NIF = NIF;
  if (telf) updateData.telf = telf;
  if (hashedPassword) updateData.password = hashedPassword;

  // Si no hay datos para actualizar, devolver un error
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No data provided to update" });
  }

  try {
    // Actualizar la clínica en la base de datos
    const updatedClinic = await prisma.clinic.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json(updatedClinic);
  } catch (error) {
    console.error(error);
   res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 * eliminar una clinica existente
 * DELETE /api/clinics/deleteClinic/:id
 */
const deleteClinic = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Required data missing" });
    }

    // Consulta de borrado
    await prisma.clinic.delete({
       where: { id: Number(id) },
    });

    
    res.status(200).send();
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: "Failed to delete the clinic." });
  }
};

const ClinicsController = {
  getAllClinics,
  createClinic,
  editClinic,
  deleteClinic,
  getClinics,
};
export default ClinicsController;
