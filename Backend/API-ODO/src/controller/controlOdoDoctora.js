import doctoraSchema from "../models/modelOdoDoctora.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  CreateDoctoraSchema,
  UpdateDoctoraSchema,
  BuscarDoctoraIDSchema,
  DeleteDoctoraSchema,
} from "../validators/validatorOdoDoctora.js";

export const CreateDoctora = [
  validatorHandler(CreateDoctoraSchema, "body"),
  async (req, res) => {
    try {
      const doctora = new doctoraSchema(req.body);
      const data = await doctora.save();
      res.status(201).json(data); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

export const BuscarDoctora = async (req, res) => {
  try {
    const data = await doctoraSchema.find().populate('Id_consultorio');
    res.json(data); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const BuscarDoctoraID = [
  validatorHandler(BuscarDoctoraIDSchema, "params"),
  async (req, res) => {
    const { _id } = req.params; 
    try {
      const doctora = await doctoraSchema.findById(_id); 
      if (!doctora) {
        return res.status(404).json({ message: "Doctora no encontrada" }); 
      }
      res.json(doctora); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

export const UpdateDoctora = [
  validatorHandler(BuscarDoctoraIDSchema, "params"),
  validatorHandler(UpdateDoctoraSchema, "body"),
  async (req, res) => {
    const { _id } = req.params; 
    const { Nombres, Apellidos, Cargo, Id_consultorio } = req.body; 
    try {
      const doctoraUpdate = await doctoraSchema.updateOne(
        { _id }, 
        { $set: { Nombres, Apellidos, Cargo, Id_consultorio } } 
      );
      if (doctoraUpdate.matchedCount === 0) {
        return res.status(404).json({ message: "Doctora no encontrada" }); 
      }
      if (doctoraUpdate.modifiedCount === 0) {
        return res.status(400).json({ message: "No se realizaron cambios en la doctora" }); 
      }
      res.status(200).json({ message: "Doctora actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

export const DeleteDoctora = [
  validatorHandler(DeleteDoctoraSchema, "params"),
  async (req, res) => {
    const { _id } = req.params; 
    try {
      const result = await doctoraSchema.deleteOne({ _id }); 
      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Doctora eliminada con éxito" });
      }
      return res.status(404).json({ message: "Doctora no encontrada" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];
