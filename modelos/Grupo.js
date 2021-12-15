const mongoose = require('mongoose');

const GrupoSchema = mongoose.Schema({
   usuarioId: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  compartilhado: {
    type: Boolean,
    required: true,
    default: false
  },
  link: {
    type: String,
  },
  ferramentas: [{
    type: String
  }]
});

module.exports = mongoose.model('Grupo', GrupoSchema);