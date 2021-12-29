const express = require('express');
const router = express.Router();
const {ensureAdmin} = require('../middleware/auth');

const GerenciadorAvisos = require('../servicos/GerenciadorAvisos');

// inicial
router.get('/', ensureAdmin, async(req, res) => {
  const avisos = await GerenciadorAvisos.recuperaTodosAvisos();
  res.render('avisos/index', {avisos});
});

// tela de criação
router.get('/add', ensureAdmin, async(req, res) => {
  res.render('avisos/add');
});

// tela de edição
router.get('/edit/:id', ensureAdmin, async(req, res) => {
  const avisoId = req.params.id;
  try {
    const aviso = await GerenciadorAvisos.recuperaAvisoPorId(avisoId);
    if (!aviso) { res.render('error/404'); }

    res.render('avisos/edit', { aviso });
  } catch (err) {
    console.error(err);
    res.render('error/500', {err});
  }
});

// cria aviso
router.post('/', ensureAdmin, async (req, res) => {
  const { dataInicial, dataFinal, mensagem } = req.body;
  try {
    await GerenciadorAvisos.criaAviso(dataInicial, dataFinal, mensagem);
    res.redirect('/avisos');
  } catch(err) {
    console.error(err);
    return res.render('error/500', {err});
  }
});

// atualiza aviso
router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const avisoId = req.params.id;
    const { dataInicial, dataFinal, mensagem } = req.body;

    await GerenciadorAvisos.alteraAviso(avisoId, dataInicial, dataFinal, mensagem);
    res.redirect('/avisos');
  } catch (err) {
    console.error(err)
    res.render('error/500', {err});
  }
});

// deleta aviso
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
      await GerenciadorAvisos.deletaAviso(req.params.id);
      res.redirect('/avisos');
  } catch (err) {
      console.error(err);
      res.render('error/500', {err});
  }
});

module.exports = router;