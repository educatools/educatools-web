const express = require('express');
const router = express.Router();
const passport = require('passport');

const GerenciadorUsuarios = require("../servicos/GerenciadorUsuarios");

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: false
    })(req, res, next);
});

router.post('/criar', async (req, res) => {
    console.log(req.body);
    const {nome, email, senha} = req.body;
    try {
        await GerenciadorUsuarios.criaUsuario(nome, email, 'usuario' , senha);
        res.sendStatus(200);
    } catch(e) {
        console.log("Erro na criação do usuário via tela de cadastro", e);
        res.sendStatus(500);
    }
});

router.get('/out', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;