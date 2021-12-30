const mongoose = require('mongoose');

const PerfilSchema = mongoose.Schema({
  usuarioId: {
    type: String,
    required: true
  },
  nomeExibicao: {
    type: String,
    required: true
  },
  minibio: {
    type: String,
    default: "Usuário do Educatools!"
  },
  profissao: {
    type: String,
    default: 'educador',
    enum: ['educador', 'estudante', 'coordenador', 'diretor', 'outro']
  },
  instituicao: {
    type: String,
    default: "Indefinido"
  },
  mostraFavoritos: {
    type: Boolean,
    default: true
  },
  mostraFerramentas: {
    type: Boolean,
    default: true
  },
  link: {
    type: String,
    required: true
  },
  ultimaAlteracao: {
    type: Date,
    default: Date.now
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Perfil', PerfilSchema);