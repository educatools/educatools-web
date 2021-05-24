const express = require('express');
const router = express.Router()
const { ensureAuth } = require('../middleware/auth');

const Ferramenta = require('../models/Ferramenta');

router.get('/', async (req, res) => {
  res.render('ferramentas/index');
});

// @descrição  Mostra todas as ferramentas cadastradas
// @rota       GET /ferramentas/all
router.get('/all', (req, res) => {
  Ferramenta.find({}, (err, ferramentas) => {
    console.log("ferramentas que encontrei", ferramentas);
    if(!err) res.send(ferramentas);
    else {
      console.error(err);
    }
  }).sort({date: 'desc'});
});

// @descrição  Salva uma ferramenta no banco de dados
// @rota       POST /ferramentas/salvar
router.post('/salvar', (request, response) => {
  const {id, usuario, nome, url, ciclos, descricao} = request.body;
  console.log("request-body", request.body);
  
  const ferramenta = new Ferramenta({
    id,
    url,
    usuario,
    data: new Date().toISOString().replace(/T/,' ').replace(/\..+/,''),
    nome,
    descricao, 
    ciclos,
    // id: Date.now().toString(),
  });

  // para ver no histórico de log
  console.log(`salvando: ${url} por ${usuario}`);

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

// router.get("/accept/:id", (req, res) => {
//   const toolId = req.params.id;

//   // para ver no histórico de log
//   console.log(`approving: document ${toolId}`);

//   Ferramenta.updateOne({"_id": toolId}, {"approved": true},  (err) => {
//     if(!err) {
//       res.sendStatus(200);
//     } else {
//       res.sendStatus(500);
//     }
//   });
// });

// router.post("/edit/:id", (req, res) => {
//   const toolId = req.params.id;
//   const body = req.body;

//   // para ver no histórico de log
//   console.log(`replacing: document ${toolId}`);
  
//   Ferramenta.replaceOne({"_id": toolId}, body,  (err) => {
//     if(!err) {
//       res.sendStatus(200);
//     } else {
//       console.error("Erro!>>>" + err);
//       res.sendStatus(500);
//     }
//   });
// });

// router.get("/refuse/:id", (req, res) => {
//   const toolId = req.params.id;

//   // para ver no histórico de log
//   console.log(`refusing: document ${toolId}`);

//   Ferramenta.deleteOne({"_id": toolId}, (err) => {
//     if(!err) {
//       res.sendStatus(200);
//     } else {
//       res.sendStatus(500);
//     }
//   });
// });


// @desc Retorna os dados de apenas uma ferramenta
// @rota GET /ferramentas/:id
router.get('/detalhes/:id', (req, res) => {
  // lembre-se: id é diferente de _id
  const idFerramenta = req.params.id;
  Ferramenta.findOne({id: idFerramenta}, (err, ferramenta) => {
    if(!err) {
      res.send(ferramenta)
    } else {
      res.sendStatus(404);
    }
  })
})

// tela de aprovação
router.get('/links', (req, res) => {
  Ferramenta.find({}, (err, ferramentas) => {
    if(!err) res.send(ferramentas);
  }).sort({date: 'desc'});
});

module.exports = router;