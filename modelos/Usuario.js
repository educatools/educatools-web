const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  sobrenome: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    default: 'usuario',
    enum: ['admin', 'usuario']
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Usuario', UsuarioSchema);
