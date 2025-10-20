import express from "express";

import DoctorsController from "../controllers/doctors.controller.js";
import { body } from "express-validator";
import validationChecker from "../middlewares/validationChecker.js";
const router = express.Router();

//GET /api/doctors/:id
router.get("/:id", DoctorsController.doctorById);
//GET /api/doctors/:id/appointments
router.get("/:id/appointments", DoctorsController.getAllAppointmentsByDoctorByDay);
//PUT /api/doctors/appointments/:appointmentId
router.put("/appointments/:appointmentId", DoctorsController.updateAppointmentTime);
//POST /api/doctors/
router.post(
  "/",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("telf").optional().isMobilePhone().withMessage("Invalid phone number"),
    body("speciality").notEmpty().withMessage("Speciality is required"),
    validationChecker,
  ],
  DoctorsController.createDoctor
);

export default router;
