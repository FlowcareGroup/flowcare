import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

const getAllPatients = async (req, res) => {
    console.log("getAllPatients");
}

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

const PatientsController = { getAllPatients, createPatient };
export default PatientsController;