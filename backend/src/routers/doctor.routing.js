import express from "express";

import DoctorsController from "../controllers/doctors.controller.js";
import { body } from "express-validator";
import validationChecker from "../middlewares/validationChecker.js";
const router = express.Router();

//GET /api/doctors/:id
router.get("/:id", DoctorsController.doctorById);
//GET /api/doctors/:id/appointments
router.get("/:id/appointments", DoctorsController.getAllAppointmentsByDoctorByDay);
//GET /api/doctors/:id/all-appointments (debug: list all)
router.get("/:id/all-appointments", DoctorsController.getAllAppointmentsForDoctor);
//GET /api/doctors/:id/available-slots
router.get("/:id/available-slots", DoctorsController.getAvailableSlots);
//POST /api/doctors/:id/test-appointments (create test data)
router.post("/:id/test-appointments", DoctorsController.createTestAppointments);
//POST /api/doctors/:id/appointments (book appointment)
router.post("/:id/appointments", DoctorsController.createAppointment);
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
