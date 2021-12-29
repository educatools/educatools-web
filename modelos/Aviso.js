const mongoose = require('mongoose');

const AvisoSchema = mongoose.Schema({
  dataInicial: {
    type: Date,
    required: true
  },
  dataFinal: {
    type: Date,
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Aviso', AvisoSchema);