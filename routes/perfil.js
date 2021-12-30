const express = require('express');
const router = express.Router()
const { ensureAuth } = require('../middleware/auth');
const GerenciadorPerfis = require('../servicos/GerenciadorPerfis');
const GerenciadorFerramentas = require('../servicos/GerenciadorFerramentas');

router.get('/escolha', async (req, res) => {
  const usuarioId = req.user._id;
  try {
    const perfil = await GerenciadorPerfis.recuperaPerfilPorUsuario(usuarioId);
    res.render('perfil/escolha', { perfil });
  } catch(err) {
    console.log(err);
    res.render('error/500', {err});
  }
});

router.get('/public/:link', async (req, res) => {
  const {link} = req.params;
  try {
    let favoritos = [];
    let ferramentas = [];
    const dados = await GerenciadorPerfis.recuperaPerfilCompletoPorLink(link);
    
    if(dados.perfil.mostraFavoritos) {
      favoritos = await GerenciadorFerramentas.recuperaTodasFerramentasFavoritas(dados.usuario._id);
    }

    if(dados.perfil.mostraFerramentas) {
      ferramentas = await GerenciadorFerramentas.recuperaTodasFerramentasSugeridasAprovadasPorUsuario(dados.usuario._id);
    }

    res.render('perfil/index', { dados, favoritos, ferramentas });
  } catch(err) {
    console.log(err);
    res.render('error/500', {err});
  }
});

router.get('/edit', ensureAuth, async (req, res) => {
  const usuarioId = req.user._id;
  const perfil = await GerenciadorPerfis.recuperaPerfilPorUsuario(usuarioId);

  res.render('perfil/edit', { perfil });
});

router.put('/:id', ensureAuth, async (req, res) => {
  const {id: perfilId} = req.params;
  const {nomeExibicao, minibio, instituicao, profissao, favoritos, ferramentas} = req.body;

  try {
    await GerenciadorPerfis.alteraPerfil(perfilId, nomeExibicao, minibio, instituicao, profissao, favoritos, ferramentas);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;