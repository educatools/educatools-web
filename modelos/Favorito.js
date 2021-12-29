const mongoose = require('mongoose');

const FavoritoSchema = mongoose.Schema({
  usuarioId: {
    type: String,
    required: true
  },
  ferramentas: [{
    type: String,
  }],
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Favorito', FavoritoSchema);