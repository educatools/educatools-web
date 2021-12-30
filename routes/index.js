const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const GerenciadorFerramentas = require('../servicos/GerenciadorFerramentas');
const GerenciadorComentarios = require('../servicos/GerenciadorComentarios');
const GerenciadorAvisos = require('../servicos/GerenciadorAvisos');
const GerenciadorPerfis = require("../servicos/GerenciadorPerfis");

router.get('/', async (req, res) => {
  const avisos = await GerenciadorAvisos.recuperaAvisosValidos(new Date());
  res.render('layouts/principal', {avisos});
});

router.get('/detalhes/:id', async (req, res) => {
  const {id: ferramentaId} = req.params;
  try {
    const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(ferramentaId);
    
    // nome de exibição de quem fez a sugestão da ferramenta
    const perfilUsuarioFerramenta = await GerenciadorPerfis.recuperaPerfilPorUsuario(ferramenta.usuarioId);
    ferramenta.usuario = perfilUsuarioFerramenta;

    const comentarios = await GerenciadorComentarios.recuperaTodosComentariosFerramenta(ferramentaId);

    if(req.user) {
      const isFavorita = await GerenciadorFerramentas.isFerramentaFavorita(ferramentaId, req.user._id);
      ferramenta.favorita = isFavorita;
    }

    for(let i = 0; i < comentarios.length; i++) {
      const { usuarioId } = comentarios[i];
      const perfil = await GerenciadorPerfis.recuperaPerfilPorUsuario(usuarioId);
      comentarios[i].usuario = perfil.nomeExibicao;
      
      if(req.user) {
        if(usuarioId === req.user.id || req.user.tipo === "admin") {
          comentarios[i].proprioOuAdmin = true;
        }
      }
    }

    res.render('detalhes', { ferramenta, comentarios });
  } catch(err) {
    console.error("Erro ao tentar detalhar ferramenta.");
    res.render('error/500', {err});
  }
});

router.post('/comentarios/:id', ensureAuth, async (req, res) => {
  const {_id: usuarioId} = req.user;
  const {id: ferramentaId} = req.params;
  const { comentario } = req.body;
  try {
    await GerenciadorComentarios.adicionarComentario(usuarioId, ferramentaId, comentario);
    res.render('detalhes', {ferramenta});
  } catch(err) {
    console.error("Erro ao tentar detalhar ferramenta.");
    res.render('error/500', {err});
  }
});

router.delete('/comentarios/:id', ensureAuth, async (req, res) => {
  console.log("back-end: tentando remover comentário");
  const {id: comentarioId} = req.params;
  try {
    await GerenciadorComentarios.removeComentario(comentarioId);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao tentar remover comentário.");
    res.sendStatus(500);
  }
});

module.exports = router;
