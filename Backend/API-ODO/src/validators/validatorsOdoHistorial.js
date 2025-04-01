import Joi from "joi";
const _id = Joi.string()
  .length(24) 
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "any.required": "El campo _id es requerido",
    "string.pattern.base": "El campo _id debe ser un ObjectId válido",
    "string.length": "El campo _id debe tener exactamente 24 caracteres",
  });

const Descripcion_tratamiento = Joi.string()
.regex(/^[A-Za-z]+$/)
.required()
.messages({
  "string.pattern.base": "El campo cargo solo puede contener letras",
  "any.required": "El campo cargo es requerido",
});

const Fecha_tratamiento = Joi.date()
  .required()
  .messages({
    "date.base": "La fecha del tratamiento debe ser una fecha válida.",
    "any.required": "La fecha del tratamiento es requerida.",
  });


export const createHistorialSchema = Joi.object({
  Descripcion_tratamiento: Descripcion_tratamiento.required(),
  Fecha_tratamiento: Fecha_tratamiento.required(),
});


const updateHistorialSchema = Joi.object({
  _id: _id.required(),
  id_historial: id_historial.required(),
  Descripccion_tratamiento: Descripccion_tratamiento.required(),
  Fecha_tratamiento: Fecha_tratamiento.required(),
});


const getHistorialSchema = Joi.object({
  _id: _id.required(),
});


const deleteHistorialSchema = Joi.object({
  _id: _id.required(),
});


