import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import mongoose from 'mongoose';
import userSchema from '../models/modelOdoUser.js';
import permisosSchema from '../models/modelOdoPermisos.js';  
import { loginSchema } from '../validators/validatorOdoLogin.js';

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;

const Login = async (req, res) => {
  try {
      
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { Correo, Clave } = req.body;

    const user = await userSchema.findOne({ Correo }).populate('Id_permiso');
    if (!user) {
      return res.status(400).json({ message: "Correo o clave incorrectos." });
      
    }
    console.log(user.Id_permiso.rol);
    const rolNombre = user.Id_permiso.rol;
    const isMatch = await bcrypt.compare(Clave, user.Clave);
    if (!isMatch) {
      return res.status(400).json({ message: "Correo o clave incorrectos." });
    }

    const token = jwt.sign(
      { id: user._id, Correo: user.Correo, Nombre: user.Nombre, Apellido: user.Apellido, Nombre_rol: rolNombre},
      
      JWT_SECRET,                          
      { expiresIn: '6h' }                  
    );

    return res.status(200).json({ 
      message: "Inicio de sesión exitoso", 
      token 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

export default Login;

