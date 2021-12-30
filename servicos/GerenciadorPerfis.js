const Perfil = require('../modelos/Perfil');
const Usuario = require('../modelos/Usuario');

const GerenciadorPerfis = {

  async criaNovoPerfil(usuarioId, nomeExibicao) {
    try {
      const perfil = new Perfil({
        usuarioId,
        nomeExibicao,
        link: geraLinkAcessoPerfil()
      });
      return await perfil.save();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar criar um novo perfil.");
    }
  },

  async alteraPerfil(perfilId, nomeExibicao, minibio, instituicao, profissao, mostraFavoritos, mostraFerramentas) {
    try {
      const filtro = { _id : perfilId };
      const update = {
        nomeExibicao, minibio, instituicao, profissao, mostraFavoritos, mostraFerramentas,
        ultimaAlteracao: new Date()};

      const opcoes = {
        new: true,
        runValidators: true,
        useFindAndModify: false
      };

      return await Perfil.findOneAndUpdate(filtro, update, opcoes);
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao atualizar perfil.");
    }
  },
  
  async recuperaPerfilCompletoPorLink(link) {
    try {
      const perfilCompleto = {};

      const perfil = await Perfil.findOne({link}).lean();
      if(perfil) {
        const usuario = await Usuario.findOne({
          _id: perfil.usuarioId
        }).lean();

        if(usuario) {
          perfilCompleto.perfil = perfil;
          perfilCompleto.usuario = usuario;
        }
      }

      return perfilCompleto;
    } catch (err) {
      console.log(err);
      throw new Error ("Erro ao tentar recuperar perfil público por link");
    }
  },

  async recuperaPerfilPorUsuario(usuarioId) {
    try {
      return await Perfil.findOne({usuarioId}).lean();
    } catch (err) {
      console.log(err);
      throw new Error ("Erro ao tentar recuperar perfil por usuário");
    }
  }

};

function geraLinkAcessoPerfil(tamanhoLink) {
  let TAMANHO = tamanhoLink || 7;
  let link = '';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var qtdCaracteresPossiveis = CHARS.length;
  for (var i = 0; i < TAMANHO; i++) {
    link += CHARS.charAt(Math.floor(Math.random() *
    qtdCaracteresPossiveis));
  }
  return link;
}


module.exports = GerenciadorPerfis;