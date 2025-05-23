import express from "express";
import { 
    CreateDoctora, 
    BuscarDoctora, 
    BuscarDoctoraID, 
    UpdateDoctora, 
    DeleteDoctora 
} from "../controller/controlOdoDoctora.js";
import { verifyJWT, verifyRole } from "../config/middlewareOdoAutenticacion.js";

const router = express.Router();  

/**
 * @swagger
 * tags:
 *   - name: Doctora
 *     description: Endpoints para gestionar las doctoras
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctora:
 *       type: object
 *       required:
 *         - Nombres
 *         - Apellidos
 *         - Cargo
 *       properties:
 *         Nombres:
 *           type: string
 *           description: Nombres de la doctora.
 *         Apellidos:
 *           type: string
 *           description: Apellidos de la doctora.
 *         Cargo:
 *           type: string
 *           description: Cargo de la doctora.
 *         Id_consultorio:
 *           type: string
 *           format: uuid
 *           description: ID del consultorio asignado a la doctora.
 *       example:
 *         Nombres: "Manuela"
 *         Apellidos: "Vera"
 *         Cargo: "Odontóloga"
 *         Id_consultorio: "64fbc1234567890abcdef123"
 */

/**
 * @swagger
 * /doctora:
 *   post:
 *     summary: Registrar una nueva doctora
 *     description: Crea un nuevo registro de doctora en el sistema.
 *     tags: [Doctora]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctora'
 *     responses:
 *       201:
 *         description: Registro de doctora creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 doctora:
 *                   $ref: '#/components/schemas/Doctora'
 *             example:
 *               message: "Doctora registrada exitosamente."
 *               doctora:
 *                 Nombres: "Manuela"
 *                 Apellidos: "Vera"
 *                 Cargo: "Odontóloga"
 *                 Id_consultorio: "64fbc1234567890abcdef123"
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Datos obligatorios faltantes."
 */
router.post("/doctora", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), CreateDoctora);

/**
 * @swagger
 * /doctora:
 *   get:
 *     summary: Retorna los registros de la entidad Doctora
 *     description: Retorna los registros de todas las doctoras
 *     tags:
 *       - Doctora
 *     responses:
 *       200:
 *         description: Lista de doctoras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctora'
 */
router.get("/doctora", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), BuscarDoctora);

/**
 * @swagger
 * /doctora/{_id}:
 *   get:
 *     summary: Retorna el registro por ID de la entidad Doctora
 *     description: Retorna el registro de una doctora por su ID
 *     tags:
 *       - Doctora
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID de la doctora a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la doctora
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctora'
 *       404:
 *         description: No se encontró la doctora con ese ID
 */
router.get("/doctora/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA', 'RECEPCIONISTA', 'PACIENTE']), BuscarDoctoraID);

/**
 * @swagger
 * /doctora/{_id}:
 *   patch:
 *     summary: Actualiza los datos de una doctora
 *     description: Actualiza el registro de una doctora en la base de datos
 *     tags:
 *       - Doctora
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID de la doctora a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombres:
 *                 type: string
 *               Apellidos:
 *                 type: string
 *               Cargo:
 *                 type: string
 *               Id_consultorio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctora actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctora'
 *       404:
 *         description: No se encontró la doctora con ese ID
 *       400:
 *         description: Error en los datos enviados para la actualización
 */
router.patch("/doctora/:_id", verifyJWT, verifyRole(['ADMIN', 'DOCTORA']), UpdateDoctora);

/**
 * @swagger
 * /doctora/{_id}:
 *   delete:
 *     summary: Elimina una doctora de la base de datos
 *     description: Elimina el registro de una doctora por su ID
 *     tags:
 *       - Doctora
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         description: ID de la doctora a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctora eliminada correctamente
 *       404:
 *         description: No se encontró la doctora con ese ID
 */
router.delete("/doctora/:_id", verifyJWT, verifyRole(['ADMIN']), DeleteDoctora);

export default router;
