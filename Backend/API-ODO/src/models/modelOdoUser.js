import mongoose from 'mongoose';

const usuarioSchema = mongoose.Schema({
  Nombre: {
    type: String, 
    required: [true, 'El nombre es obligatorio'], 
  },
  Apellido: {
    type: String, 
    required: [true, 'El apellido es obligatorio'], 
  },
  Tipo_Doc: {
    type: String, 
    required: [true, 'El tipo de documento es obligatorio'], 
    enum: {
      values: ['T.I', 'C.C', 'PA'], 
      message: 'El tipo de documento debe ser uno de los siguientes valores: T.I, C.C, PA', 
    },
  },
  Doc_identificacion: {
    type: String,
    required: [true, "El documento de identificación es obligatorio"],
    unique: true,
    trim: true,
  },
  Telefono: {
    type: Number, 
    required: [true, 'El número de teléfono es obligatorio'], 
  },
  Correo: {
    type: String, 
    required: [true, 'El correo es obligatorio'], 
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'El correo no tiene un formato válido', 
    ],
  },
  Clave: {
    type: String, 
    required: [true, 'La clave es obligatoria'], 
    minlength: [8, 'La clave debe tener al menos 8 caracteres'], 
  },
  Permiso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permiso",
    required: true,
  }  
}, {
  timestamps: true, 
});

export default mongoose.model('Usuario', usuarioSchema);