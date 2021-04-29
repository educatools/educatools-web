const express = require('express');
const router = express.Router()
const { ensureAuth } = require('../middleware/auth');

const Ferramenta = require('../models/Ferramenta');

router.get('/', async (req, res) => {
  res.render('ferramentas/index');
})

router.post('/save', (request, response) => {
  const {username, title, url, grades, description, thumbnail } = request.body;
  const ferramenta = new Ferramenta({
    url,
    title,
    grades,
    username, 
    thumbnail,
    description,
    approved: false,
    isMobile: false,
    id: Date.now().toString(),
    date: new Date().toISOString().replace(/T/,' ').replace(/\..+/,'')
  });

  // para ver no histórico de log
  console.log(`salvando: ${url} por ${username}`);

  ferramenta.save(err => {
    if(err) {
      console.error('Ocorreu um erro ao tentar gravar o registro no banco de dados.');
      console.error(err);

      response.sendStatus(500);
    }
    else {
      response.sendStatus(200);
    }
  })
});

router.get("/accept/:id", (req, res) => {
  const toolId = req.params.id;

  // para ver no histórico de log
  console.log(`approving: document ${toolId}`);

  Ferramenta.updateOne({"_id": toolId}, {"approved": true},  (err) => {
    if(!err) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

router.post("/edit/:id", (req, res) => {
  const toolId = req.params.id;
  const body = req.body;

  // para ver no histórico de log
  console.log(`replacing: document ${toolId}`);
  
  Ferramenta.replaceOne({"_id": toolId}, body,  (err) => {
    if(!err) {
      res.sendStatus(200);
    } else {
      console.error("Erro!>>>" + err);
      res.sendStatus(500);
    }
  });
});

router.get("/refuse/:id", (req, res) => {
  const toolId = req.params.id;

  // para ver no histórico de log
  console.log(`refusing: document ${toolId}`);

  Ferramenta.deleteOne({"_id": toolId}, (err) => {
    if(!err) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

// @descrição  Mostra todas as ferramentas cadastradas
// @rota       GET /ferramentas/all
router.get('/all', (req, res) => {
  Ferramenta.find({"approved": true}, (err, ferramentas) => {
    if(!err) res.send(ferramentas);
  }).sort({date: 'desc'});
});

// tela de aprovação
router.get('/links', (req, res) => {
  Ferramenta.find({}, (err, ferramentas) => {
    if(!err) res.send(ferramentas);
  }).sort({date: 'desc'});
});

module.exports = router;