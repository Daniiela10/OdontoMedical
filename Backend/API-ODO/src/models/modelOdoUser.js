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
      values: [
        'RC', // Registro Civil de Nacimiento
        'TI', // Tarjeta de Identidad
        'CC', // Cédula de Ciudadanía
        'TE', // Tarjeta de Extranjería
        'CE', // Cédula de Extranjería
        'NIT', // Número de Identificación Tributaria
        'PP', // Pasaporte
        'PEP', // Permiso Especial de Permanencia
        'DIE', // Documento de Identificación Extranjero
        'PA' // (Si quieres mantenerlo por compatibilidad)
      ], 
      message: 'El tipo de documento debe ser uno de los siguientes valores: RC, TI, CC, TE, CE, NIT, PP, PEP, DIE, PA', 
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
  },
  Genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    enum: {
      values: ['Masculino', 'Femenino', 'Otro'],
      message: 'El género debe ser Masculino, Femenino u Otro',
    },
  },
  Edad: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [0, 'La edad no puede ser negativa'],
    max: [120, 'La edad no puede ser mayor a 120'],
  }
}, {
  timestamps: true, 
});

export default mongoose.model('Usuario', usuarioSchema);