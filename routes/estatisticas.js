const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/auth');

const GerenciadorEstatisticas = require('../servicos/GerenciadorEstatisticas');

router.get('/', ensureAdmin, (req, res) => {
  res.render("estatisticas");
});

router.get('/usuarios/:dataInicio/:dataFim', ensureAdmin, async (req, res) => {
  const {dataInicio, dataFim} = req.params;
  try {
    const dadosUsuarios = await GerenciadorEstatisticas.recuperaQuantidadeUsuariosCriadosNoPeriodoPorTipo(dataInicio, dataFim);
    res.send(dadosUsuarios);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/ferramentas/:dataInicio/:dataFim', ensureAdmin, async (req, res) => {
  const {dataInicio, dataFim} = req.params;
  try {
    const dadosFerramentas = await GerenciadorEstatisticas.recuperaQuantidadeFerramentasCriadasNoPeriodoPorCiclo(dataInicio, dataFim);
    res.send(dadosFerramentas);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/ferramentas-status/:dataInicio/:dataFim', ensureAdmin, async (req, res) => {
  const {dataInicio, dataFim} = req.params;
  try {
    const dadosFerramentas = await GerenciadorEstatisticas.recuperaQuantidadeFerramentasCriadasNoPeriodoPorStatus(dataInicio, dataFim);
    res.send(dadosFerramentas);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/grupos/:dataInicio/:dataFim', ensureAdmin, async (req, res) => {
  const {dataInicio, dataFim} = req.params;
  try {
    const dadosGrupos = await GerenciadorEstatisticas.recuperaQuantidadeGruposCriadosNoPeriodo(dataInicio, dataFim);
    res.send(dadosGrupos);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/contagem/:dataInicio/:dataFim', ensureAdmin, async (req, res) => {
  const {dataInicio, dataFim} = req.params;
  try {
    const dados = await GerenciadorEstatisticas.recuperaQuantidadesDasEntidadesNoPeriodo(dataInicio, dataFim);
    res.send(dados);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;