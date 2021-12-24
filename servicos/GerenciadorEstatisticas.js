const Usuario = require('../modelos/Usuario');
const Ferramenta = require('../modelos/Ferramenta');
const Grupo = require('../modelos/Grupo');

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
  }

}

module.exports = GerenciadorEstatisticas;