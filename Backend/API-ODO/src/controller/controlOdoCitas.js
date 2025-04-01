import CitaSchema from "../models/modelOdoCitas.js";

export const createCita = async (req, resp) => {
  try {
    const cita = new CitaSchema(req.body);
    const data = await cita.save();
    resp.status(201).json({ message: "Cita creada exitosamente", data });
  } catch (error) {
    resp.status(500).json({ message: "Error al crear la cita", error: error.message });
  }
};

export const getCitas = async (req, resp) => {
  try {
    const data = await CitaSchema.find()
      .populate("servicios", "nombre") // Solo traemos el campo 'nombre' del servicio
      .populate("doctora", "nombre apellido") // Traemos nombre y apellido de la doctora
      .populate("consultorio", "nombre ubicacion"); // Traemos nombre y ubicación del consultorio
    resp.status(200).json({ message: "Citas obtenidas exitosamente", data });
  } catch (error) {
    resp.status(500).json({ message: "Error al obtener las citas", error: error.message });
  }
};

export const getCitaById = async (req, resp) => {
  const { _id } = req.params;
  try {
    const data = await CitaSchema.findOne({ _id })
      .populate("servicios", "nombre")
      .populate("doctora", "nombre apellido")
      .populate("consultorio", "nombre ubicacion");
    if (data) {
      resp.status(200).json({ message: "Cita encontrada", data });
    } else {
      resp.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (error) {
    resp.status(500).json({ message: "Error al obtener la cita", error: error.message });
  }
};

export const updateCita = async (req, resp) => {
  const { _id } = req.params;
  const { documentoCliente, nombreCliente, apellidoCliente, servicios, doctora, consultorio, fecha, hora } = req.body;

  try {
    const data = await CitaSchema.updateOne(
      { _id },
      { $set: { documentoCliente, nombreCliente, apellidoCliente, servicios, doctora, consultorio, fecha, hora } }
    );

    if (data.matchedCount === 0) {
      resp.status(404).json({ message: `No se encontró una cita con el ID ${_id}.` });
    } else if (data.modifiedCount === 0) {
      resp.status(200).json({ message: "La cita ya estaba actualizada. No se realizaron cambios." });
    } else {
      resp.status(200).json({ message: "Cita actualizada exitosamente." });
    }
  } catch (error) {
    resp.status(500).json({
      message: "Ocurrió un error al actualizar la cita.",
      error: error.message,
    });
  }
};

export const deleteCita = async (req, resp) => {
  const { _id } = req.params;
  try {
    const data = await CitaSchema.deleteOne({ _id });
    if (data.deletedCount > 0) {
      resp.status(200).json({ message: "Cita eliminada exitosamente" });
    } else {
      resp.status(404).json({ message: "Cita no encontrada" });
    }
  } catch (error) {
    resp.status(500).json({ message: "Error al eliminar la cita", error: error.message });
  }
};