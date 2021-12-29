const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  senha: {
    type: String,
  },
  nome: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    default: 'usuario',
    enum: ['admin', 'usuario']
  },
  googleId: {
    type: String,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Usuario', UsuarioSchema);
