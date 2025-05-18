import bcrypt from "bcryptjs";
import userSchema from "../models/modelOdoUser.js";
import { validatorHandler } from "../middleware/validator.handler.js";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "../validators/validatorOdoUser.js";

const handleError = (res, error, message) => {
  res.status(500).json({ message: `${message}: ${error.message}` });
};

export const crearusuario = [
  validatorHandler(createUserSchema, "body"),
  async (req, res) => {
    try {
      const {
        Nombre,
        Apellido,
        Tipo_Doc,
        Doc_identificacion,
        Telefono,
        Correo,
        Clave,
        Permiso,
        Genero,
        Edad,
      } = req.body;

      // Verificar que el campo Permiso esté presente
      if (!Permiso) {
        return res.status(400).json({ message: "El campo Permiso es obligatorio" });
      }

      const hashedPassword = await bcrypt.hash(Clave, 10);
      const user = new userSchema({
        Nombre,
        Apellido,
        Tipo_Doc,
        Doc_identificacion,
        Telefono,
        Correo,
        Clave: hashedPassword,
        Permiso,
        Genero,
        Edad,
      });

      const data = await user.save();
      res.status(201).json(data);
    } catch (error) {
      handleError(res, error, "Error interno del servidor");
    }
  },
];

export const llamarUsuarios = async (req, res) => {
  try {
    const data = await userSchema.find().populate("Permiso");
    res.json(data);
  } catch (error) {
    handleError(res, error, "Error al obtener usuarios");
  }
};

export const llamarUsuId = [
  validatorHandler(getUserSchema, "params"),
  async (req, res) => {
    const { _id } = req.params;
    try {
      const user = await userSchema.findById(_id).populate("Permiso");
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      handleError(res, error, "Error al obtener el usuario");
    }
  },
];

export const ActualizarUsu = [
  validatorHandler(getUserSchema, "params"),
  validatorHandler(updateUserSchema, "body"),
  async (req, res) => {
    const { _id } = req.params;
    const {
      Nombre,
      Apellido,
      Tipo_Doc,
      Doc_identificacion,
      Telefono,
      Correo,
      Clave,
      Permiso,
      Genero,
      Edad,
    } = req.body;
    if (!Permiso) {
      return res.status(400).json({ message: "El campo Permiso es obligatorio" });
    }

    try {
      const hashedPassword = Clave ? await bcrypt.hash(Clave, 10) : undefined;
      const updateData = {
        Nombre,
        Apellido,
        Tipo_Doc,
        Doc_identificacion,
        Telefono,
        Correo,
        Permiso,
        Genero,
        Edad,
      };

      if (hashedPassword) {
        updateData.Clave = hashedPassword;
      }

      const userUpdate = await userSchema.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!userUpdate) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario actualizado correctamente", data: userUpdate });
    } catch (error) {
      handleError(res, error, "Error al actualizar el usuario");
    }
  },
];

export const borrarUsu = [
  validatorHandler(deleteUserSchema, "params"),
  async (req, res) => {
    const { _id } = req.params;
    try {
      const result = await userSchema.findByIdAndDelete(_id);
      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      handleError(res, error, "Error al eliminar el usuario");
    }
  },
];