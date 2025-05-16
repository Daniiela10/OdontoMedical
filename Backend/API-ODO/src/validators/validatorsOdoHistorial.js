import { body } from 'express-validator';

export const historialClinicoValidator = [
  body('paciente').notEmpty().withMessage('El paciente es obligatorio'),
  body('cita').notEmpty().withMessage('La cita es obligatoria'),
  body('servicio').notEmpty().withMessage('El servicio es obligatorio'),
  body('doctora').notEmpty().withMessage('La doctora es obligatoria'),
  body('consultorio').notEmpty().withMessage('El consultorio es obligatorio'),
  body('descripcionTratamiento')
    .notEmpty().withMessage('La descripción del tratamiento es obligatoria')
    .isLength({ max: 1000 }).withMessage('La descripción no debe superar los 1000 caracteres'),
  body('fechaAtencion').notEmpty().withMessage('La fecha de atención es obligatoria')
];