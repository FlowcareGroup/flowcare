import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();




/*
 * Obtener todas los usuarios
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if(users.length === 0){
      return res.status(200).json({ error: 'No hay usuarios' });
    }
    res.json(users);
  } catch (error) {
    console.error('Tienes este error: ',error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/*
 * crear un nuevo usuario
 * POST /api/users
 */
const putData = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(req.body);
    // Validar que los campos necesarios estén presentes
    if (!name || !email ) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Crear un nuevo usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Tienes este error: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/*
 * editar un usuario existente
 * PUT /api/users/:id 
 */
const editData = async (req, res) => {
 try {
    const { id } = req.params; // ID del usuario a actualizar, viene de la URL
    const { name, email } = req.body; // Nuevos datos a actualizar, vienen del cuerpo de la petición

    
    const updatedUser = await prisma.user.update({
      // Se usa 'where' para identificar el registro único.
      where: {
        id: parseInt(id), // Importante: Convertir el ID de la URL a entero si es numérico
      },
      // 2. QUÉ actualizar: Se usa 'data' para especificar los campos y nuevos valores.
      data: {
        name: name,
        email: email,
        
      },
    });

    // Respuesta exitosa
    res.status(200).json(updatedUser);

  } catch (error) {
    // Manejo de errores común: Si el usuario no existe, Prisma lanza un error.
    if (error.code === 'P2025') {
      // P2025 es el código de error de Prisma para "registro no encontrado" en una operación 'update' o 'delete'.
      return res.status(404).json({ error: `Usuario con ID ${req.params.id} no encontrado.` });
    }
    
    console.error('Error al actualizar:', error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor al intentar actualizar el usuario.' });
  }
};


/*
 * editar un usuario existente
 * DELETE /api/users/:id 
 */
const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    // Consulta de borrado
    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    // Respuesta 204 No Content (sin cuerpo)
    res.status(200).send(); 
  } catch (error) {
    // Manejar el error si el registro no existe
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar el usuario.' });
  }
};







const UsersController = { getAllUsers, putData ,deleteData, editData};


export default UsersController;