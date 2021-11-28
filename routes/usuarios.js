const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const GerenciadorUsuarios = require('../servicos/GerenciadorUsuarios');
const Usuario = require('../modelos/Usuario');

router.get('/', ensureAuth, async (req, res) => {
    try {
        const usuarios = await Usuario.find({}).lean();
        res.render('usuarios', {
            usuarios
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});

router.post('/', ensureAuth, async (req, res) => {
    try {
        const { nome, email, tipo, senha } = req.body;
        await GerenciadorUsuarios.criaUsuario(nome, email, tipo, senha);
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const {nome, email, tipo} = req.body;

        await GerenciadorUsuarios.alteraUsuario(id, nome, email, tipo);

        res.redirect("/usuarios");
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let usuarios = await Usuario.findById(req.params.id).lean();
        if (!usuarios) {
            return res.render('error/404');
        }
        await Usuario.remove({ _id: req.params.id });
        res.redirect('/usuarios');
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            _id: req.params.id,
        }).lean()

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

router.put('/:id', async (req, res) => {
    try {
        let usuarios = await Usuario.findById(req.params.id).lean();

        if (!usuarios) {
            return res.render('error/404')
        }

        usuarios = await Usuario.findOneAndUpdate({
            _id: req.params.id
        },
            req.body, {
            new: true,
            runValidators: true,
        });

        res.redirect('/usuarios');

    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
});

router.get('/add', ensureAuth, (req, res) => {
    res.render('usuarios/add');
});

module.exports = router;