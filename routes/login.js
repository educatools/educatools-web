const express = require('express');
const router = express.Router();
const passport = require('passport');

const GerenciadorUsuarios = require("../servicos/GerenciadorUsuarios");
const GerenciadorPerfis = require('../servicos/GerenciadorPerfis');

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

router.get('/google', passport.authenticate('google', { 
    scope: ['profile'] 
}));

router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/' 
}), (req, res) => {
    res.redirect('/dashboard');
  }
);

router.post('/criar', async (req, res) => {
    const {nome, email, senha} = req.body;
    try {
        const { _id:usuarioId, nome: nomeExibicao } = await GerenciadorUsuarios.criaUsuario(nome, email, 'usuario' , senha);
        await GerenciadorPerfis.criaNovoPerfil(usuarioId, nomeExibicao);
        res.sendStatus(200);
    } catch(e) {
        console.log("Erro na criação do usuário via tela de cadastro", e);
        res.sendStatus(500);
    }
});

// referência:
// https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout
// https://stackoverflow.com/questions/31641884/does-passports-logout-function-remove-the-cookie-if-not-how-does-it-work#:~:text=Passport's%20logout%20function%20does%20not,isn't%20actually%20a%20problem.
router.get('/out', (req, res) => {
    req.logout();
    req.logOut();
    req.session.destroy((err) => {
        if(err) console.log("Erro ao deslogar", err);
        res.clearCookie('sid', {path: '/'});
        res.redirect('/');
    });
});


module.exports = router;