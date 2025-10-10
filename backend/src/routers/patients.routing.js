import express from "express";
import PatientsController from '../controllers/patients.controller.js';
import { body } from 'express-validator';
import validationChecker from '../middlewares/validationChecker.js';

const router = express.Router();

router.use(express.json());

router.get("/", PatientsController.getAllPatients);
router.post("/", PatientsController.createPatient);
//POST /api/patients/login
router.post("/login",[
    body("email").isEmail().withMessage("Email no válido"),
    // body("password")
    //   .isLength({ min: 6 })
    //   .withMessage("La contraseña debe tener al menos 6 caracteres")
    //   .matches(/[0-9]/)
    //   .withMessage("La contraseña debe contener al menos un número")
    //   .matches(/[!@#$%^&*(),.?":{}|<>]/)
    //   .withMessage("La contraseña debe contener al menos un carácter especial")
    //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    //   .withMessage(
    //     "La contraseña debe contener al menos una mayúscula, una minúscula"
    //   ),
    validationChecker,
  ], PatientsController.loginPatient);



export default router;