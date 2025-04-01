import mongoose from "mongoose";

const historialSchema = mongoose.Schema(
  {
    Descripcion_tratamiento: {
      type: String,
      required: true,
      trim: true,
    },
    Fecha_tratamiento: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    Timestamps: true,
  }
);

const Historial = mongoose.model("Historial", historialSchema);

export default Historial;

