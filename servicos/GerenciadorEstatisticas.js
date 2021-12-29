const Usuario = require('../modelos/Usuario');
const Ferramenta = require('../modelos/Ferramenta');
const Grupo = require('../modelos/Grupo');
const Favorito = require('../modelos/Favorito');
const Comentario = require('../modelos/Comentario');

const GerenciadorEstatisticas = {

  /**
   * Referências:
   *  → https://www.youtube.com/watch?v=Kk6Er0c7srU
  */
  async recuperaQuantidadeUsuariosCriadosNoPeriodoPorTipo(dataInicio, dataFim) {
    try {
      return await Usuario.aggregate([{
        $match: {
          criadoEm: {
            $gte: new Date(dataInicio),
            $lte: new Date(dataFim)
          }
        }
      }]).group({
        _id: "$tipo",
        count: { $sum: 1 }
      });
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao tentar recuperar dados sobre usuários criados.");
    }
  },

  /**
   * Referências:
   *  → https://www.youtube.com/watch?v=Kk6Er0c7srU
   *  → https://www.chartjs.org/docs/2.7.2/general/responsive.html#important-note
  */
  async recuperaQuantidadeFerramentasCriadasNoPeriodoPorCiclo(dataInicio, dataFim) {
    try {
      return await Ferramenta.aggregate([{
        $match: {
          criadoEm: {
            $gte: new Date(dataInicio),
            $lte: new Date(dataFim)
          }
        }
      }]).group({
        _id: "$ciclos",
        count: { $sum: 1 }
      });
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao tentar recuperar dados sobre usuários criados.");
    }
  },

  //TODO: Refatorar para utilizar a mesma estrutura do método recuperaQuantidadeFerramentasCriadasNoPeriodoPorCiclo() e não ficar com código repetido.
  async recuperaQuantidadeFerramentasCriadasNoPeriodoPorStatus(dataInicio, dataFim) {
    try {
      return await Ferramenta.aggregate([{
        $match: {
          criadoEm: {
            $gte: new Date(dataInicio),
            $lte: new Date(dataFim)
          }
        }
      }]).group({
        _id: "$status",
        count: { $sum: 1 }
      });
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao tentar recuperar dados sobre usuários criados.");
    }
  },

  async recuperaQuantidadeGruposCriadosNoPeriodo(dataInicio, dataFim) {
    try {
      return await Grupo.aggregate([{
        $match: {
          criadoEm: {
            $gte: new Date(dataInicio),
            $lte: new Date(dataFim)
          }
        }
      }]).group({
        _id: "$compartilhado",
        count: { $sum: 1 }
      });
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao tentar recuperar dados sobre grupos criados.");
    }
  },

  async recuperaQuantidadesDasEntidadesNoPeriodo(dataInicio, dataFim) {
    const dados = [];
    const filtro = {
      criadoEm: {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      }
    }
    try {
      dados.push({ _id: "ferramentas", count: await Ferramenta.find(filtro).count() });
      dados.push({ _id: "favoritos", count: await Favorito.find(filtro).count() });
      dados.push({ _id: "comentarios", count: await Favorito.find(filtro).count() });

      return dados;
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao tentar recuperar dados da relação de ferramentas e comentários.");
    }
  }

}

module.exports = GerenciadorEstatisticas;