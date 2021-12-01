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
  }

};

module.exports = GerenciadorFerramentas;