const Aviso = require('../modelos/Aviso');

const GerenciadorAvisos = {

  async criaAviso(dataInicial, dataFinal, mensagem) {
    const aviso = new Aviso({
      dataInicial, dataFinal, mensagem
    });
    try {
      return await aviso.save();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao criar novo aviso.");
    }
  },

  async alteraAviso(avisoId, dataInicial, dataFinal, mensagem) {
    try {
      const filtro = {_id: avisoId};
      const update = { dataInicial, dataFinal, mensagem };

      const opcoes = {
        new: true,
        runValidators: true,
        useFindAndModify: false
      };

      return await Aviso.findOneAndUpdate(filtro, update, opcoes);

    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar atualizar dados de um aviso.");
    }
  },

  async deletaAviso(avisoId) {
    try { 
      await Aviso.deleteOne({_id: avisoId});
    } catch(err) {
      throw new Error("Erro ao tentar deletar um aviso", err);
    }
  },

  async recuperaTodosAvisos() {
    try {
      return Aviso.find({}).lean();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar todas os avisos.");
    }
  },

  async recuperaAvisoPorId(avisoId) {
    try {
      return await Aviso.findById(avisoId).lean();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar aviso por id.");
    }
  },

  async recuperaAvisosValidos(data) {
    try {
      return await Aviso.find({
        dataInicial: {
          $lte: new Date(data)
        },
        dataFinal: {
          $gte: new Date(data)
        }
      }).lean();
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao tentar recuperar aviso.");
    }
  }

};

module.exports = GerenciadorAvisos;