const express = require('express');
const router = express.Router()
const { ensureAuth } = require('../middleware/auth');

const Ferramenta = require('../modelos/Ferramenta');

router.get('/', ensureAuth, async (req, res) => {
  const ferramentas = await Ferramenta.find({}).lean();
  res.render('ferramentas/index', {
    ferramentas
  });
});

router.get('/add', ensureAuth, async (req, res) => {
  res.render('ferramentas/add');
})

router.get('/edit/:id', async (req, res) => {
  try {
    const ferramenta = await Ferramenta.findOne({
      _id: req.params.id,
    }).lean()

    if (!ferramenta) {
      return res.render('error/404');
    }

    res.render('ferramentas/edit', {
      ferramenta
    });
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
});

// @descrição  Mostra todas as ferramentas cadastradas
// @rota       GET /ferramentas/all
router.get('/all', (req, res) => {
  Ferramenta.find({ status: 'aprovado' }, (err, ferramentas) => {
    console.log("ferramentas que encontrei", ferramentas);
    if (!err) res.send(ferramentas);
    else {
      console.error(err);
    }
  }).sort({ date: 'desc' });
});

// @descrição  Salva uma ferramenta no banco de dados
// @rota       POST /ferramentas/salvar
router.post('/', (req, res) => {
  const { id, nome, url, ciclos, descricao, video } = req.body;
  const usuario = req.user.nome;

  console.log("request-body", req.body);

  const ferramenta = new Ferramenta({
    id,
    url,
    usuario,
    data: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    nome,
    descricao,
    ciclos,
    video
  });

  ferramenta.save(err => {
    if (err) {
      console.error('Ocorreu um erro ao tentar gravar o registro no banco de dados.');
      console.error(err);

      res.sendStatus(500);
    }
    else {
      res.redirect('/ferramentas');
    }
  })
});

router.put('/:id', async (req, res) => {
  try {
    let ferramenta = await Ferramenta.findById(req.params.id).lean();

    if (!ferramenta) {
      return res.render('error/404')
    }

    ferramenta = await Ferramenta.findOneAndUpdate({
      _id: req.params.id
    },
      req.body, {
      new: true,
      runValidators: true,
    });

    res.redirect('/ferramentas');

  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
});

router.delete('/:id', async (req, res) => {
  try {
      await Ferramenta.remove({ _id: req.params.id });
      res.redirect('/ferramentas');
  } catch (err) {
      console.error(err);
      return res.render('error/500');
  }
})

// @desc Retorna os dados de apenas uma ferramenta
// @rota GET /ferramentas/:id
router.get('/detalhes/:id', (req, res) => {
  // lembre-se: id é diferente de _id
  const idFerramenta = req.params.id;
  Ferramenta.findOne({ id: idFerramenta }, (err, ferramenta) => {
    if (!err) {
      res.send(ferramenta)
    } else {
      res.sendStatus(404);
    }
  })
})

module.exports = router;