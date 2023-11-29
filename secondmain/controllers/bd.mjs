import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  user: String,
  email: { type: String, unique: true },
  password: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;