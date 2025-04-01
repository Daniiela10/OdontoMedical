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

const Nombres = Joi.string()
  .min(3)
  .max(50)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El campo Nombres debe ser un texto",
    "string.empty": "El campo Nombres no puede estar vacío.",
    "string.min": "El campo Nombres debe tener al menos 3 caracteres.",
    "string.max": "El campo Nombres no puede exceder los 50 caracteres.",
    "string.pattern.base": "El campo Nombres solo puede contener letras y espacios.",
    "any.required": "El campo Nombres es requerido",
  });

const Apellidos = Joi.string()
  .min(3)
  .max(50)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El campo Apellidos debe ser un texto",
    "string.empty": "El campo Apellidos no puede estar vacío.",
    "string.min": "El campo Apellidos debe tener al menos 3 caracteres.",
    "string.max": "El campo Apellidos no puede exceder los 50 caracteres.",
    "string.pattern.base": "El campo Apellidos solo puede contener letras y espacios.",
    "any.required": "El campo Apellidos es requerido",
  });

const Cargo = Joi.string()
  .max(50)
  .required()
  .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    "string.base": "El campo Cargo debe ser un texto",
    "string.empty": "El campo Cargo no puede estar vacío.",
    "string.max": "El campo Cargo no puede exceder los 50 caracteres.",
    "string.pattern.base": "El campo Cargo solo puede contener letras",
    "any.required": "El campo Cargo es requerido",
  });

const Id_consultorio = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "any.required": "El campo Id_consultorio es requerido",
    "string.pattern.base": "El campo Id_consultorio debe ser un ObjectId válido",
    "string.length": "El campo Id_consultorio debe tener exactamente 24 caracteres",
  });

export const CreateDoctoraSchema = Joi.object({
  Nombres: Nombres.required(),
  Apellidos: Apellidos.required(),
  Cargo: Cargo.required(),
  Id_consultorio: Id_consultorio.required(),
});

export const UpdateDoctoraSchema = Joi.object({
  Nombres: Nombres.required(),
  Apellidos: Apellidos.required(),
  Cargo: Cargo.required(),
  Id_consultorio: Id_consultorio.required(),
});

export const BuscarDoctoraIDSchema = Joi.object({
  _id: _id.required(),
});

export const DeleteDoctoraSchema = Joi.object({
  _id: _id.required(),
});
