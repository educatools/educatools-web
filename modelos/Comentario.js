const mongoose = require('mongoose');

const ComentarioSchema = mongoose.Schema({
  usuarioId: {
    type: String,
    require: true
  },
  ferramentaId: {
    type: String,
    require: true
  },
  comentario: {
    type: String,
    require: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comentario", ComentarioSchema);