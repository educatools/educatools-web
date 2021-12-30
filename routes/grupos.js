const { reset } = require('browser-sync');
const express = require('express');
const router = express.Router()
const {ensureAuth} = require('../middleware/auth');

const GerenciadorFerramentas = require('../servicos/GerenciadorFerramentas');
const GerenciadorGruposFerramentas = require('../servicos/GerenciadorGruposFerramentas');
const GerenciadorUsuarios = require('../servicos/GerenciadorUsuarios');
const GerenciadorPerfis = require('../servicos/GerenciadorPerfis');

router.get('/', ensureAuth, async(req, res) => {
  const {_id: usuarioId} = req.user;
  const grupos = await GerenciadorGruposFerramentas.recuperaTodosGruposFerramentas(usuarioId);
  res.render('grupos/index', { grupos });
});

router.get('/add', ensureAuth, (req, res) => {
  res.render('grupos/add');
});


router.post('/', ensureAuth, async (req, res) => {
  const {_id: usuarioId} = req.user;
  const {nome, compartilhado} = req.body;
  const ferramentas = JSON.parse(req.body.ferramentas);

  const ferramentasIds = ferramentas.map(ferramenta => {
    return ferramenta.id;
  })
  console.log("ferramentas depois do parse", ferramentasIds);

  try {
    await GerenciadorGruposFerramentas.criaGrupoFerramentas(usuarioId, nome, compartilhado, ferramentasIds);
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.render('error/500');
  }

  console.log("o nome do grupo é: ", nome);
  console.log("as ferramentas que chegaram são:", ferramentas);
  //const { id, nome, url, ciclos, descricao, video } = req.body;
});

router.get('/edit/:id', ensureAuth, async (req, res) => {
  const grupoId = req.params.id;
  try {
    const grupo = await GerenciadorGruposFerramentas.recuperaGrupoFerramentasPorId(grupoId);

    const {ferramentas:ferramentasIds} = grupo;
    const ferramentas = [];
    for(let i = 0; i < ferramentasIds.length; i++) {
      const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(ferramentasIds[i]);
      ferramentas.push(ferramenta);
    }

    if (!grupo) {
      res.render('error/404');
    }

    res.render('grupos/edit', { grupo, ferramentas });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

router.post('/:id', ensureAuth, async (req, res) => {
  console.log("tentando atualizar o registro do grupo");
  try {
    const grupoId = req.params.id;
    const { nome, compartilhado } = req.body;
    const ferramentas = JSON.parse(req.body.ferramentas);

    const ferramentasIds = ferramentas.map(ferramenta => {
      return ferramenta.id;
    });

    await GerenciadorGruposFerramentas.alteraGrupo(grupoId, nome, ferramentasIds, compartilhado);
    
    res.redirect('/grupos');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

router.delete('/:id', ensureAuth, async(req, res) => {
  try {
    const grupoId = req.params.id;
    await GerenciadorGruposFerramentas.deletaGrupoFerramentas(grupoId);
    res.redirect('/grupos');
  } catch(err) {
    console.error(err);
    res.render('error/500');
  }
});

router.get('/public/:id', async(req, res) => {
  try {
    const linkGrupo = req.params.id;
    const grupo = await GerenciadorGruposFerramentas.recuperaGrupoPorLinkUnico(linkGrupo);
  
    if(!grupo || !grupo.compartilhado) {
      return res.render('error/404');
    }

    const perfil = await GerenciadorPerfis.recuperaPerfilPorUsuario(grupo.usuarioId);
  
    const {ferramentas:ferramentasIds} = grupo;
    const ferramentas = [];
    for(let i = 0; i < ferramentasIds.length; i++) {
      const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(ferramentasIds[i]);
      ferramentas.push(ferramenta);
    }
  
    res.render('grupos/public', { perfil, grupo, ferramentas });
  } catch(err) {
    console.log(err);
    res.render('error/505');
  }
})

module.exports = router;