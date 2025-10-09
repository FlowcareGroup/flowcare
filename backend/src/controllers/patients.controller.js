import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

 const getAllPatients = async (req,res)=>{
    console.log("getAllPatients");
 }

 const createPatient = async (req,res)=>{
    console.log("createPatient");
 }

const PatientsController = {getAllPatients,createPatient};
export default PatientsController;