const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/auth');

const GerenciadorUsuarios = require('../servicos/GerenciadorUsuarios');
const GerenciadorPerfis = require('../servicos/GerenciadorPerfis');

router.get('/', ensureAdmin, async (req, res) => {
  try {
    const usuarios = await GerenciadorUsuarios.recuperaTodosUsuarios();
    res.render('usuarios', {
      usuarios
    })
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

router.post('/', ensureAdmin, async (req, res) => {
  try {
    const { nome, email, tipo, senha } = req.body;
    const {_id: usuarioId, nome: nomeExibicao} = await GerenciadorUsuarios.criaUsuario(nome, email, tipo, senha);
    await GerenciadorPerfis.criaNovoPerfil(usuarioId, nomeExibicao);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
})

router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, email, tipo } = req.body;

    await GerenciadorUsuarios.alteraUsuario(id, nome, email, tipo);

    res.redirect("/usuarios");
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    await GerenciadorUsuarios.deletaUsuario(req.params.id);
    res.redirect('/usuarios');
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

router.get('/edit/:id', ensureAdmin, async (req, res) => {
  try {
    const usuario = await GerenciadorUsuarios.recuperaUsuarioPorId(req.params.id);
    if (!usuario) {
      return res.render('error/404');
    }

    res.render('usuarios/edit', {
      usuario
    });
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
});

router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const {id} = req.params;
    const {nome, email, tipo} = req.body;
    await GerenciadorUsuarios.alteraUsuario(id, nome, email, tipo);
    res.redirect('/usuarios');
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
});

router.get('/add', ensureAdmin, (req, res) => {
  res.render('usuarios/add');
});

module.exports = router;