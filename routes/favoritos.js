const express = require('express');
const router = express.Router()
const { ensureAuth, ensureAdmin } = require('../middleware/auth');
const GerenciadorFerramentas = require("../servicos/GerenciadorFerramentas");

router.get("/", ensureAuth, async (req, res) => {
  const ferramentas = await GerenciadorFerramentas.recuperaTodasFerramentasFavoritas(req.user._id);
  res.render("favoritos", {ferramentas});
});

router.get('/favoritar/:id', ensureAuth, async(req, res) => {
  const {_id: usuarioId} = req.user;
  const {id: ferramentaId} = req.params;
  try {
    const isFavorita = await GerenciadorFerramentas.isFerramentaFavorita(ferramentaId, usuarioId);
    if(isFavorita) {
      await GerenciadorFerramentas.desfavoritarFerramenta(ferramentaId, usuarioId);
    } else {
      await GerenciadorFerramentas.favoritarFerramenta(ferramentaId, usuarioId);
    }
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const {id: ferramentaId} = req.params;
    const {_id: usuarioId} = req.user;
    await GerenciadorFerramentas.desfavoritarFerramenta(ferramentaId, usuarioId);
    res.redirect('/favoritos');
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

router.get("/checaFavorito/:id", ensureAuth, async (req, res) => {
  try {
    const {id: ferramentaId} = req.params;
    const {_id: usuarioId} = req.user;
    const favorito = await GerenciadorFerramentas.isFerramentaFavorita(ferramentaId, usuarioId);
    res.send({favorito});
  } catch (err) { 
    console.error(err);
    res.send({favorito: false});
  }
});

module.exports = router;