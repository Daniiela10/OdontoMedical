import Joi from "joi";
import moment from "moment";

// Validación para el campo _id
const _id = Joi.string()
  .length(24)
  .pattern(/^[a-fA-F0-9]{24}$/)
  .required()
  .messages({
    "any.required": "El campo _id es requerido",
    "string.pattern.base": "El campo _id debe ser un ObjectId válido",
    "string.length": "El campo _id debe tener exactamente 24 caracteres",
  });

// Validación para el documento del cliente
const documentoCliente = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(8)
  .max(15)
  .required()
  .messages({
    "any.required": "El campo documentoCliente es requerido.",
    "string.pattern.base": "El campo documentoCliente solo puede contener números.",
    "string.min": "El campo documentoCliente debe tener al menos 8 caracteres.",
    "string.max": "El campo documentoCliente no puede exceder los 15 caracteres.",
  });

// Validación para el nombre y apellido del cliente
const nombreCliente = Joi.string()
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  .min(1)
  .max(50)
  .required()
  .messages({
    "any.required": "El campo nombreCliente es requerido.",
    "string.pattern.base": "El campo nombreCliente solo puede contener letras y espacios.",
    "string.min": "El campo nombreCliente debe tener al menos 1 carácter.",
    "string.max": "El campo nombreCliente no puede exceder los 50 caracteres.",
  });

const apellidoCliente = Joi.string()
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  .min(1)
  .max(50)
  .required()
  .messages({
    "any.required": "El campo apellidoCliente es requerido.",
    "string.pattern.base": "El campo apellidoCliente solo puede contener letras y espacios.",
    "string.min": "El campo apellidoCliente debe tener al menos 1 carácter.",
    "string.max": "El campo apellidoCliente no puede exceder los 50 caracteres.",
  });

// Validación para el servicio, doctora y consultorio (referencias)
const servicio = _id.messages({
  "any.required": "El campo servicio es requerido.",
});
const doctora = _id.messages({
  "any.required": "El campo doctora es requerido.",
});
const consultorio = _id.messages({
  "any.required": "El campo consultorio es requerido.",
});

// Validación para la fecha y hora
const fecha = Joi.date()
  .required()
  .custom((value, helpers) => {
    const dayOfWeek = moment(value).day();
    const hora = helpers.state.ancestors[0].hora;

    // Restricción para ortodoncia
    if (helpers.state.ancestors[0].servicio === "ortodoncia") {
      if (dayOfWeek !== 4) {
        return helpers.message("Las citas para ortodoncia solo están disponibles los jueves.");
      }
      if (hora < "14:00" || hora > "19:00") {
        return helpers.message("El horario para ortodoncia es de 2 PM a 7 PM.");
      }
    } else {
      // Restricción para otros servicios
      if (hora < "11:00" || hora > "19:00") {
        return helpers.message("El horario para otros servicios es de 11 AM a 7 PM.");
      }
    }
    return value;
  })
  .messages({
    "any.required": "El campo fecha es requerido.",
  });

const hora = Joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .required()
  .messages({
    "any.required": "El campo hora es requerido.",
    "string.pattern.base": "El campo hora debe estar en formato HH:mm (24 horas).",
  });

// Esquemas para las operaciones
const createCitaSchema = Joi.object({
  documentoCliente,
  nombreCliente,
  apellidoCliente,
  servicio,
  doctora,
  consultorio,
  fecha,
  hora,
});

const updateCitaSchema = Joi.object({
  _id,
  documentoCliente,
  nombreCliente,
  apellidoCliente,
  servicio,
  doctora,
  consultorio,
  fecha,
  hora,
});

const getCitaSchema = Joi.object({
  _id,
});

const deleteCitaSchema = Joi.object({
  _id,
});

export {
  createCitaSchema,
  updateCitaSchema,
  getCitaSchema,
  deleteCitaSchema,
};