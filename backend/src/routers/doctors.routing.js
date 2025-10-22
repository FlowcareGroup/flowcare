import express from "express";

import DoctorsController from "../controllers/doctors.controller.js";
import { body } from "express-validator";
import validationChecker from "../middlewares/validationChecker.js";
import { getAuthUser } from '../middlewares/auth.js';
const router = express.Router();

//solo puede estrar si esta logueado

router.use(getAuthUser);


//GET /api/doctors/getAllDoctors
router.get("/getAllDoctors", DoctorsController.getAllDoctors);

//GET /api/doctors/getDoctorById/:id
router.get("/getDoctorById/:id", DoctorsController.getDoctorById);

//POST /api/doctors/createDoctor
router.post("/createDoctor", DoctorsController.createDoctor);

//PUT /api/doctors/editDoctor/:id
router.put("/editDoctor/:id", DoctorsController.editDoctor);

//DELETE /api/doctors/deleteDoctor/:id
router.delete("/deleteDoctor/:id", DoctorsController.deleteDoctor);






export default router;