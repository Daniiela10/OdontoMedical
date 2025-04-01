import historialSchema from "../models/modelOdoHistoriales.js";


export const createHistorial = (req, resp) => {



    const Historial = new historialSchema(req.body);
    Historial
        .save()
        .then((data) => resp.status(201).json(data))
        .catch((error) => resp.status(500).json({ message: error.message }));
};


export const getHistorial = (req, resp) => {
    historialSchema
        .find()
        .then((data) => resp.status(200).json(data))
        .catch((error) => resp.status(500).json({ message: error.message }));
};


export const getHistorialById = (req, resp) => {
    const { _id } = req.params;
    historialSchema
        .findOne({_id: _id })
        .then((data) => {
            if (data) {
                resp.status(200).json(data);
            } else {
                resp.status(404).json({ message: "Historial no encontrado" });
            }
        })
        .catch((error) => resp.status(500).json({ message: error.message }));
};


export const updateHistorial = (req, resp) => {
    const { _id } = req.params;
    const { Descripcion_tratamiento, Fecha_tratamiento } = req.body;


  
    historialSchema
        .updateOne(
            { _id: _id },
            { $set: { Descripcion_tratamiento, Fecha_tratamiento } }
        )
        .then((data) => {
            if (data.matchedCount === 0) {
                resp.status(404).json({ 
                    message: `No se encontró un historial con el ID ${_id}.` 
                });
            } else if (data.modifiedCount === 0) {
                resp.status(200).json({ 
                    message: "El historial ya estaba actualizado. No se realizaron cambios." 
                });
            } else {
                resp.status(200).json({ 
                    message: "Historial actualizado exitosamente." 
                });
            }
        })
        .catch((error) => {
            resp.status(500).json({ 
                message: "Ocurrió un error al actualizar el historial.",
                error: error.message
            });
        });
};
export const deleteHistorial = (req, resp) => {
    const { _id } = req.params;
    historialSchema
        .deleteOne({ _id: _id })
        .then((data) => {
            if (data.deletedCount > 0) {
                resp.status(200).json({ message: "Historial eliminado exitosamente" });
            } else {
                resp.status(404).json({ message: "Historial no encontrado" });
            }
        })
        .catch((error) => resp.status(500).json({ message: error.message }));
};
