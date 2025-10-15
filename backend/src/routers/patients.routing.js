import express from "express";

import PatientsController from "../controllers/patients.controller.js";
import { body } from "express-validator";
import validationChecker from "../middlewares/validationChecker.js";
const router = express.Router();

router.use(express.json());

//POST /api/patients/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email no válido"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("The password must be at least 8 characters long")
      .matches(/[0-9]/)
      .withMessage("The password must contain at least one number")
      .matches(/[!@#$%^&*(),.?\":{}|<>]/)
      .withMessage("The password must contain at least one special character")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .withMessage(
        "The password must contain at least one uppercase letter and one lowercase letter"
      ),
    validationChecker,
  ],
  PatientsController.loginPatient
);

//POST /api/patients/
router.post(
  "/",
  [
    // body("identifier")
    //   .notEmpty()
    //   .withMessage("Identifier is required")
    //   .matches(/^[0-9]{8}[A-Za-z]$/)
    //   .withMessage("Identifier must be 8 digits + 1 letter"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    // body("name_family").notEmpty().withMessage("Family name is required"),
    body("name_given").notEmpty().withMessage("Given name is required"),
    // body("gender")
    //   .isIn(["male", "female", "other", "unknown"])
    //   .withMessage("Invalid gender value"),
    // body("birth_date").isISO8601().withMessage("Invalid birth date format"),
    // body("address").notEmpty().withMessage("Address is required"),
    // body("marital_status")
    //   .isIn(["single", "married", "divorced", "widowed", "unknown"])
    //   .withMessage("Invalid marital status value"),
  ],
  validationChecker,
  PatientsController.createPatient
);

export default router;
