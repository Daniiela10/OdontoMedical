// models/HistorialClinico.js
import mongoose from "mongoose";

const historialClinicoSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario", // Paciente que recibió el tratamiento
    required: true,
  },
  cita: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cita", // Cita asociada al historial clínico
    required: true,
  },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Servicios", // Tratamiento realizado
    required: true,
  },
  doctora: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctora", // Quien atendió
    required: true,
  },
  consultorio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultorio", // Lugar donde fue atendido
    required: true,
  },
  descripcionTratamiento: {
    type: String,
    required: [true, "La descripción del tratamiento es obligatoria"],
    maxlength: [1000, "La descripción no puede exceder los 1000 caracteres"]
  },
  fechaAtencion: {
    type: Date,
    required: [true, "La fecha de atención es obligatoria"]
  },
  observaciones: {
    type: String,
    default: "",
    maxlength: [500, "Las observaciones no pueden exceder los 500 caracteres"]
  },
  archivoAdjunto: {
    type: String, // Podría ser una URL de imagen o PDF (si decides subir archivos)
    default: null,
  }
}, {
  timestamps: true // Crea campos createdAt y updatedAt
});

export default mongoose.model("HistorialClinico", historialClinicoSchema);
