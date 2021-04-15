const mongoose = require('mongoose');

const FerramentaSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    default: Date.now,
  },
  titulo: {
    type: String,
    required: true
  },
  grades: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: String,
  isMobile: Boolean
});

module.exports = mongoose.model('Ferramenta', FerramentaSchema);

//TODO: ver se conseguimos usar enum no modelo dos schemas
/*
ciclos: {
  type: String,
  default: 'public',
  enum: ['public', 'private'],
},
*/