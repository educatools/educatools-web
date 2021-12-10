const mongoose = require('mongoose');

const FavoritoSchema = mongoose.Schema({
  usuarioId: {
    type: String,
    required: true
  },
  ferramentas: [{
    type: String,
  }],
});

module.exports = mongoose.model('Favorito', FavoritoSchema);