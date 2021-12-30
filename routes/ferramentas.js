const express = require('express');
const router = express.Router()
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

const GerenciadorFerramentas = require("../servicos/GerenciadorFerramentas");

router.get('/', ensureAdmin, async (req, res) => {
  try {
    const ferramentas = await GerenciadorFerramentas.recuperaTodasFerramentas();
    res.render('ferramentas/index', { ferramentas });
  } catch(err) {
    console.log(err);
    res.render('error/500')
  }
});

router.get('/add', ensureAuth, async (req, res) => {
  res.render('ferramentas/add');
})

router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(id);
    
    if (!ferramenta) {
      res.render('error/404');
    }

    res.render('ferramentas/edit', {
      ferramenta
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @descrição  Mostra todas as ferramentas cadastradas
// @rota       GET /ferramentas/all
router.get('/all', async (req, res) => {
  try {
    const ferramentas = await GerenciadorFerramentas.recuperaTodasFerramentas({status: "aprovado"});
    res.send(ferramentas);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// @descrição  Salva uma ferramenta no banco de dados
// @rota       POST /ferramentas/salvar
router.post('/', ensureAuth, async (req, res) => {
  const { _id: usuarioId } = req.user._id;
  const { id, nome, url, ciclos, descricao, video, desenvolvedor } = req.body;
  try {
    await GerenciadorFerramentas.criaFerramenta(id, url, usuarioId, nome, descricao, ciclos, video, desenvolvedor);
    res.redirect('/ferramentas');
  } catch(err) {
    console.error(err);
    return res.render('error/500');
  }
});

router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, url, descricao, status, ciclos, video, desenvolvedor } = req.body;

    await GerenciadorFerramentas.alteraFerramenta(id, nome, url, descricao, status, ciclos, video, desenvolvedor);
    
    res.redirect('/ferramentas');

  } catch (err) {
    console.error(err)
    res.render('error/500');
  }
});

router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
      await GerenciadorFerramentas.deletaFerramenta(req.params.id);
      res.redirect('/ferramentas');
  } catch (err) {
      console.error(err);
      res.render('error/500');
  }
});

module.exports = router;