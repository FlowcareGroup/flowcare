import express from "express";
import UsersController from "../controllers/users.controller.js"; 
const router = express.Router();

router.use(express.json());


// GET /api/users - obtener todos los usuarios
router.get("/", UsersController.getAllUsers);
// POST /api/users - añadir un nuevo usuario
router.post("/", UsersController.putData);
// PUT /api/users/:id - editar un usuario existente
router.put("/:id", UsersController.editData);
// DELETE /api/users/:id  - eliminar un usuario existente
router.delete("/:id", UsersController.deleteData);



export default router;