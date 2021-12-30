const Grupo = require('../modelos/Grupo');

const GerenciadorGruposFerramentas = {

  async recuperaTodosGruposFerramentas(usuarioId) {
    try {
      return await Grupo.find({usuarioId}).lean();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar todos os grupos de ferramentas");
    }
  },
  
  async recuperaGrupoFerramentasPorId(grupoId) {
    try {
      return await Grupo.findOne({_id: grupoId}).lean();
    } catch(err) {
      console.error(err);
      throw new Error("Erro ao tentar recuperar um grupo de ferramentas por id.");
    }
  },

  async criaGrupoFerramentas(usuarioId, nome, compartilhado, ferramentasIds) {
    const grupo = new Grupo({
      usuarioId, 
      nome,
      link: geraLinkAcessoGrupo(),
      compartilhado,
      ferramentas: ferramentasIds
    });

    try {
      return await grupo.save();
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao criar novo grupo de ferramentas.");
    }
  },

  async alteraGrupo(grupoId, nome, ferramentasIds, compartilhado) {
    try {
      const filtro = {_id : grupoId};
      const update = {nome, ferramentas: ferramentasIds, compartilhado};

      const opcoes = {
        new: true,
        runValidators: true,
        useFindAndModify: false
      };

      return await Grupo.findOneAndUpdate(filtro, update , opcoes);
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar atualizar dados de uma ferramenta.");
    }
  },

  async deletaGrupoFerramentas(grupoId) {
    try {
      await Grupo.deleteOne({_id: grupoId});
    } catch(err) {
      throw new Error("Erro ao tentar deletar um grupo de ferramentas.", err);
    }
  },

  async recuperaGrupoPorLinkUnico(link) {
    try {
      return await Grupo.findOne({link}).lean();
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar um grupo por link único");
    }
  }

}

function geraLinkAcessoGrupo(tamanhoLink) {
  let TAMANHO = tamanhoLink || 5;
  let link = '';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var qtdCaracteresPossiveis = CHARS.length;
  for (var i = 0; i < TAMANHO; i++) {
    link += CHARS.charAt(Math.floor(Math.random() *
    qtdCaracteresPossiveis));
  }
  return link;
}

module.exports = GerenciadorGruposFerramentas;