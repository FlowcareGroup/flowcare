import express from "express";
import PatientsController from "../controllers/patients.controller.js";
const router = express.Router();

router.use(express.json());

router.get("/", PatientsController.getAllPatients);
router.post("/", PatientsController.createPatient);


export default router;