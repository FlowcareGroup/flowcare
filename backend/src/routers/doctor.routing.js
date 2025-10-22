import express from "express";

import DoctorsController from "../controllers/doctors.controller.js";
import { body } from "express-validator";
import validationChecker from "../middlewares/validationChecker.js";
const router = express.Router();

//PATCH /api/doctors/appointments/:appointmentId/cancel
router.patch("/appointments/:appointmentId/cancel", DoctorsController.cancelAppointment);
//PUT /api/doctors/appointments/:appointmentId
router.put("/appointments/:appointmentId", DoctorsController.updateAppointmentTime);

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
//GET /api/doctors/:id/appointments/:appointmentId (appointment details)
router.get("/:id/appointments/:appointmentId", DoctorsController.getAppointmentDetails);
//PATCH /api/doctors/:id/appointments/:appointmentId/status (update appointment status)
router.patch("/:id/appointments/:appointmentId/status", DoctorsController.updateAppointmentStatus);
//POST /api/doctors/:id/appointments/:appointmentId/observations (add observation)
router.post(
  "/:id/appointments/:appointmentId/observations",
  DoctorsController.addObservationToAppointment
);
//POST /api/doctors/:id/appointments/:appointmentId/prescriptions (add prescription)
router.post(
  "/:id/appointments/:appointmentId/prescriptions",
  DoctorsController.addPrescriptionToAppointment
);
//GET /api/doctors/:id/appointments/:appointmentId/prescriptions (get prescriptions)
router.get(
  "/:id/appointments/:appointmentId/prescriptions",
  DoctorsController.getPrescriptionsForAppointment
);
//GET /api/doctors/:id/search-patients (search patients)
router.get("/:id/search-patients", DoctorsController.searchPatients);
//GET /api/doctors/:id/statistics (doctor statistics)
router.get("/:id/statistics", DoctorsController.getDoctorStatistics);
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
