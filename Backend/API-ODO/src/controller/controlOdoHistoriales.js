import HistorialClinico from '../models/modelOdoHistoriales.js';

export const crearHistorial = async (req, res) => {
  try {
    const historial = new HistorialClinico(req.body);
    const historialGuardado = await historial.save();
    res.status(201).json(historialGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear historial', error });
  }
};

export const obtenerHistoriales = async (req, res) => {
  try {
    const historiales = await HistorialClinico.find()
      .populate('paciente')
      .populate('cita')
      .populate('servicio')
      .populate('doctora')
      .populate('consultorio');
    res.json(historiales);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener historiales', error });
  }
};

export const obtenerHistorialPorId = async (req, res) => {
  try {
    const historial = await HistorialClinico.findById(req.params.id)
      .populate('paciente')
      .populate('cita')
      .populate('servicio')
      .populate('doctora')
      .populate('consultorio');
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener historial', error });
  }
};

export const actualizarHistorial = async (req, res) => {
  try {
    const historial = await HistorialClinico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    res.json(historial);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar historial', error });
  }
};

export const eliminarHistorial = async (req, res) => {
  try {
    const historial = await HistorialClinico.findByIdAndDelete(req.params.id);
    if (!historial) return res.status(404).json({ mensaje: 'Historial no encontrado' });
    res.json({ mensaje: 'Historial eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar historial', error });
  }
};