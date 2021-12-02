const Ferramenta = require('../modelos/Ferramenta');

const GerenciadorFerramentas = {

  async recuperaTodasFerramentas() {
    try {
      return Ferramenta.find({}).lean();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar todas as ferramentas.");
    }
  },

  async recuperaFerramentaPorId(id) {
    try {
      return await Ferramenta.findById(id).lean();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar ferramenta por id.");
    }
  },

  async criaFerramenta(id, url, usuario, nome, descricao, ciclos, video) {
    const ferramenta = new Ferramenta({
      id,
      url,
      usuario,
      data: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      nome,
      descricao,
      ciclos,
      video
    });

    try {
      return await ferramenta.save();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao criar nova ferramenta.");
    }
  },

  async alteraFerramenta(id, nome, url, ciclos, descricao, status, video) {
    try {
      const filtro = {_id: id};
      const update = {nome, url, ciclos, descricao, status, video};
      const opcoes = {
        new: true,
        runValidators: true
      };

      return await Ferramenta.findOneAndUpdate(filtro, update , opcoes);

    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar atualizar dados de uma ferramenta.");
    }

  },

  async deletaFerramenta(id) {
    try { 
      await Ferramenta.remove({_id: id});
    } catch(err) {
      throw new Error("Erro ao tentar deletar uma ferramenta", err);
    }
  }

};

module.exports = GerenciadorFerramentas;