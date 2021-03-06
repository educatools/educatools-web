const Ferramenta = require('../modelos/Ferramenta');
const Favorito = require('../modelos/Favorito');

const GerenciadorFerramentas = {

  async recuperaTodasFerramentas(filtro) {
    const filtroBusca = filtro ? filtro : {};
    try {
      return Ferramenta.find(filtroBusca).lean();
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

  async criaFerramenta(id, url, usuarioId, nome, descricao, ciclos, video, desenvolvedor) {
    const ferramenta = new Ferramenta({
      id,
      url,
      usuarioId,
      data: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      nome,
      descricao,
      ciclos,
      video, 
      desenvolvedor
    });

    try {
      return await ferramenta.save();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao criar nova ferramenta.");
    }
  },

  async alteraFerramenta(id, nome, url, descricao, status, ciclos, video, desenvolvedor) {
    try {
      const filtro = {_id: id};
      const update = {nome, url, descricao, status, ciclos, video, desenvolvedor};

      const opcoes = {
        new: true,
        runValidators: true,
        useFindAndModify: false
      };

      return await Ferramenta.findOneAndUpdate(filtro, update , opcoes);

    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar atualizar dados de uma ferramenta.");
    }

  },

  async deletaFerramenta(id) {
    try { 
      await Ferramenta.deleteOne({_id: id});
    } catch(err) {
      throw new Error("Erro ao tentar deletar uma ferramenta", err);
    }
  },

  async favoritarFerramenta(ferramentaId, usuarioId) {
    try {
      let favorito = await Favorito.findOne({usuarioId});
      
      // se não houver nenhuma instância de favorito para o usuário, cria uma
      // com a ferramenta já inclusa
      if(!favorito) {
        favorito = new Favorito({
          usuarioId,
          ferramentas: [ferramentaId]
        });

        await favorito.save();
      } else {
        let ferramentaJaSalvaNosFavoritos = favorito.ferramentas.find((ferramentaFavoritaId) => {
          return ferramentaFavoritaId === ferramentaId;
        });

        // FIXME: quando a ferramenta já está salva, o ideal é removê-la dos favoritos
        if(!ferramentaJaSalvaNosFavoritos) {
          favorito.ferramentas.push(ferramentaId);
          await favorito.save();
        }
      }
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar favoritar uma ferramenta", err);
    }
  },

  async desfavoritarFerramenta(ferramentaId, usuarioId) {
    try {
      const favorito = await Favorito.findOne({usuarioId});
      if(!favorito) throw new Error("Não há favoritos para este usuário");

      const {ferramentas} = favorito;
      const ferramentasAtualizadas = ferramentas.filter(ferramenta => {
        return ferramenta !== ferramentaId;
      })

      favorito.ferramentas = ferramentasAtualizadas;
      await favorito.save();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar desfavoritar uma ferramenta", err);
    }
  },

  async isFerramentaFavorita(ferramentaId, usuarioId) {
    try {
      const favorito = await Favorito.findOne({usuarioId});
      if(!favorito) return false;

      const ferramentaFavorita = favorito.ferramentas.find(ferramentaFavoritaId => {
        return ferramentaFavoritaId === ferramentaId;
      });

      if(ferramentaFavorita) return true;

      return false;
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar checar se uma ferramenta é favorita", err);
    }
  },

  async recuperaTodasFerramentasFavoritas(usuarioId) {
    try {
      const ferramentasFavoritas = [];
      const favorito = await Favorito.findOne({usuarioId}).lean();
      
      if(favorito) {
        const {ferramentas} = favorito;
        for(ferramentaId of ferramentas) {
          const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(ferramentaId);
          ferramentasFavoritas.push(ferramenta);
        }
      }
      
      return ferramentasFavoritas;
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar os favoritos do usuário.");
    }
  },

  async recuperaTodasFerramentasSugeridasAprovadasPorUsuario(usuarioId) {
    try {
      return await Ferramenta.find({
        usuarioId, 
        status: "aprovado"
      }).lean();
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar as ferramentas sugeridas aprovadas do usuário.");
    }
  }

};

module.exports = GerenciadorFerramentas;