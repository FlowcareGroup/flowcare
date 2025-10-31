import express from 'express'

import ClinicsController from "../controllers/clinics.controller.js";
import { body } from "express-validator";
import validationChecker from "../middlewares/validationChecker.js";
import  {requireRole}  from "../middlewares/auth.rol.js";
import { getAuthUser } from '../middlewares/auth.js';
const router = express.Router();





//GET /api/clinics/getAllClinics
router.get("/getAllClinics", ClinicsController.getAllClinics);

//solo puede estrar si esta logueado
router.use(getAuthUser);

//GET /api/clinics/getClinics/:id
router.get('/getClinics/:id', ClinicsController.getClinics)

//para que solo pueda entrar un admin
router.use(requireRole('admin'))

//POST /api/clinics/createClinic
router.post(
  '/createClinic',
  [
    body('email').isEmail().withMessage('Email no válido'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[0-9]/)
      .withMessage('La contraseña debe contener al menos un número')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('La contraseña debe contener al menos un carácter especial')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .withMessage(
        'La contraseña debe contener al menos una mayúscula, una minúscula'
      ),
    body('name')
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage('THe name is required'),
    body('NIF')
      .notEmpty()
      .isLength({ min: 8 })
      .isLength({ max: 20 })
      .withMessage('The NIF is required'),
    body('telf')
      .notEmpty()
      .isLength({ min: 9, max: 15 })
      .withMessage('The telf is required'),
    validationChecker
  ],
  ClinicsController.createClinic
)
//PUT /api/clinics/editClinic/:id
router.put(
  '/editClinic/:id',
  [
    body('email').isEmail().optional().withMessage('Email no válido'),
    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[0-9]/)
      .withMessage('La contraseña debe contener al menos un número')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('La contraseña debe contener al menos un carácter especial')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .withMessage(
        'La contraseña debe contener al menos una mayúscula, una minúscula'
      ),
    body('name')
      .optional()
      .isLength({ min: 8 })
      .withMessage('THe name is required'),
    body('NIF')
      .optional()
      .isLength({ min: 8 })
      .isLength({ max: 20 })
      .withMessage('The NIF is required'),
    body('telf')
      .optional()
      .isLength({ min: 9, max: 15 })
      .withMessage('The telf is required'),
    validationChecker
  ],
  ClinicsController.editClinic
)
//DELETE /api/clinics/deleteClinic/:id
router.delete('/deleteClinic/:id', ClinicsController.deleteClinic)

export default router
