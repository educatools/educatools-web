const mongoose = require('mongoose');

const FerramentaSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    default: Date.now,
  },
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  ciclos: {
    type: String,
    default: 'todos',
    enum: ['infantil', 'fundamental 1', 'fundamental 2', 'médio', 'superior', 'todos']
  },
  usuario: {
    type: String,
    required: false
  },
  video: {
    type: String,
    required: false
  },
  status: {
    type: String,
    default: 'sugestão',
    enum: ['aprovado', 'reprovado', 'sugestão']
  }
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