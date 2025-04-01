import express from "express";
import { 
    createHistorial, 
    getHistorial, 
    getHistorialById, 
    updateHistorial, 
    deleteHistorial 
} from "../controller/controlOdoHistoriales.js";
import { verifyJWT, verifyRole } from "../config/middlewareOdoAutenticacion.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Historiales
 *     description: Operaciones relacionadas con los historiales odontológicos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Historial:
 *       type: object
 *       required:
 *         - Descripcion_tratamiento
 *         - Fecha_tratamiento
 *       properties:
 *         Descripcion_tratamiento:
 *           type: string
 *           description: Descripción detallada del tratamiento realizado.
 *         Fecha_tratamiento:
 *           type: string
 *           format: date
 *           description: >-
 *             Fecha en la que se realizó el tratamiento. El formato debe ser
 *             YYYY-MM-DD.
 *         Id_servicio:
 *           type: string
 *           format: uuid
 *           description: ID del servicio asociado al tratamiento.
 *         Id_usuario:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que recibió el tratamiento.
 *         Id_doctora:
 *           type: string
 *           format: uuid
 *           description: ID de la doctora que realizó el tratamiento.
 *       example:
 *         Descripcion_tratamiento: "Limpieza dental y revisión general."
 *         Fecha_tratamiento: "2024-12-05"
 *         Id_servicio: "64fbc1234567890abcdef123"
 *         Id_usuario: "64fbc1234567890abcdef456"
 *         Id_doctora: "64fbc1234567890abcdef789"
 */

/**
 * @swagger
 * /historial:
 *   post:
 *     summary: Crear un nuevo historial odontológico
 *     description: Crear un historial de odontología con detalles como nombre, edad y género del paciente.
 *     tags: [Historiales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Historial'
 *     responses:
 *       201:
 *         description: Historial creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post("/historial", createHistorial);

/**
 * @swagger
 * /historial:
 *   get:
 *     summary: Obtener todos los historiales odontológicos
 *     description: Obtener una lista de todos los historiales registrados.
 *     tags: [Historiales]
 *     responses:
 *       200:
 *         description: Lista de historiales
 *       500:
 *         description: Error del servidor
 */
router.get("/historial", getHistorial);

/**
 * @swagger
 * /historial/{_id}:
 *   get:
 *     summary: Obtener un historial odontológico por ID
 *     description: Obtener un historial específico por su ID.
 *     tags: [Historiales]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: El ID del historial odontológico a recuperar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial encontrado exitosamente
 *       404:
 *         description: Historial no encontrado
 */
router.get("/historial/:_id", getHistorialById);

/**
 * @swagger
 * /historial/{_id}:
 *   patch:
 *     summary: Actualizar un historial odontológico
 *     description: Actualizar los detalles de un historial odontológico, incluyendo nombre, edad y género.
 *     tags: [Historiales]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: El ID del historial a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Historial'
 *     responses:
 *       200:
 *         description: Historial actualizado exitosamente
 *       400:
 *         description: Error en la solicitud de actualización
 *       404:
 *         description: Historial no encontrado
 */
router.patch("/historial/:_id", updateHistorial);

/**
 * @swagger
 * /historial/{_id}:
 *   delete:
 *     summary: Eliminar un historial odontológico
 *     description: Eliminar un historial odontológico específico por su ID.
 *     tags: [Historiales]
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: El ID del historial a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial eliminado exitosamente
 *       404:
 *         description: Historial no encontrado
 */
router.delete("/historial/:_id", deleteHistorial);

export default router;
