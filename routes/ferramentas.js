const express = require('express');
const router = express.Router()
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

const GerenciadorFerramentas = require("../servicos/GerenciadorFerramentas");
const Ferramenta = require('../modelos/Ferramenta');

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
router.get('/all', (req, res) => {
  Ferramenta.find({ status: 'aprovado' }, (err, ferramentas) => {
    if (!err) res.send(ferramentas);
    else {
      console.error(err);
    }
  }).sort({ date: 'desc' });
});

// @descrição  Salva uma ferramenta no banco de dados
// @rota       POST /ferramentas/salvar
router.post('/', ensureAuth, async (req, res) => {
  const usuario = req.user.nome;
  const { id, nome, url, ciclos, descricao, video } = req.body;
  try {
    await GerenciadorFerramentas.criaFerramenta(id, url, usuario, nome, descricao, ciclos, video);
    res.redirect('/ferramentas');
  } catch(err) {
    console.error(err);
    return res.render('error/500');
  }
});

router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, url, descricao, status, ciclos, video } = req.body;

    await GerenciadorFerramentas.alteraFerramenta(id, nome, url, descricao, status, ciclos, video);
    
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

// @desc Retorna os dados de apenas uma ferramenta
// @rota GET /ferramentas/:id

// FIXME: remover ideia de id e fazer por nome (ou inventar um slug tipo o wordpress)
router.get('/detalhes/:id', (req, res) => {
  const {id: ferramentaId} = req.params;
  Ferramenta.findOne({ _id: ferramentaId }, (err, ferramenta) => {
    if (!err) {
      res.send(ferramenta)
    } else {
      res.sendStatus(404);
    }
  })
})

module.exports = router;