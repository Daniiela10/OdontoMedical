import mongoose from "mongoose";

const doctoraSchema = new mongoose.Schema({
    Nombres: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        maxlength: [50, "El nombre no puede exceder los 50 caracteres"]
    },
    Apellidos: {
        type: String,
        required: [true, "El apellido es obligatorio"],
        trim: true,
        maxlength: [50, "El apellido no puede exceder los 50 caracteres"]
    },
    Cargo: {
        type: String,
        required: [true, "El cargo es obligatorio"],
        trim: true,
        maxlength: [50, "El cargo no puede exceder los 50 caracteres"]
    },
    Id_consultorio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultorio",
        required: [true, "El ID del consultorio es obligatorio"]
    }
}, {
    timestamps: true
});

export default mongoose.model("Doctora", doctoraSchema);
