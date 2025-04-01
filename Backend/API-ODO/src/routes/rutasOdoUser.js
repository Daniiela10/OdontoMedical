import express from "express";
import { 
    ActualizarUsu, 
    borrarUsu, 
    crearusuario, 
    llamarUsuarios, 
    llamarUsuId 
} from "../controller/controlOdoUser.js";

const modelOdoUsers = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Endpoints para manejar usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - Nombre
 *         - Apellido
 *         - Tipo_Doc
 *         - Doc_identificacion
 *         - Telefono
 *         - Correo
 *         - Clave
 *         - Permiso
 *       properties:
 *         Nombre:
 *           type: string
 *           description: Nombre del usuario.
 *         Apellido:
 *           type: string
 *           description: Apellido del usuario.
 *         Tipo_Doc:
 *           type: string
 *           description: Tipo de documento del usuario.
 *           enum:
 *             - T.I
 *             - C.C
 *             - PA
 *           example: T.I
 *         Doc_identificacion:
 *           type: number
 *           description: Número de identificación del usuario.
 *         Telefono:
 *           type: number
 *           description: Número de teléfono del usuario.
 *         Correo:
 *           type: string
 *           description: Correo electrónico del usuario.
 *           example: "usuario@example.com"
 *         Clave:
 *           type: string
 *           description: Clave del usuario (mínimo 8 caracteres).
 *           minLength: 8
 *         Permiso:
 *           type: string
 *           description: ID de permiso asociado al usuario.
 *           example: "64fbc1234567890abcdef123"
 *       example:
 *         Nombre: "Juan"
 *         Apellido: "Pérez"
 *         Tipo_Doc: "C.C"
 *         Doc_identificacion: 123456789
 *         Telefono: 3001234567
 *         Correo: "juan.perez@example.com"
 *         Clave: "secreta123"
 *         Permiso: "64fbc1234567890abcdef123"
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Permite crear un nuevo usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la información del usuario
 */
modelOdoUsers.post("/users", crearusuario);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve una lista de todos los usuarios.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
modelOdoUsers.get("/users", llamarUsuarios);

/**
 * @swagger
 * /users/{_id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Devuelve los detalles de un usuario específico usando su ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del usuario que se desea obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
modelOdoUsers.get("/users/:_id", llamarUsuId);

/**
 * @swagger
 * /users/{_id}:
 *   patch:
 *     summary: Actualizar un usuario existente
 *     description: Permite actualizar los datos de un usuario existente.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del usuario que se desea actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en los datos del usuario
 *       404:
 *         description: Usuario no encontrado
 */
modelOdoUsers.patch("/users/:_id",  ActualizarUsu);

/**
 * @swagger
 * /users/{_id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Permite eliminar un usuario por su ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
modelOdoUsers.delete("/users/:_id", borrarUsu);

export default modelOdoUsers;