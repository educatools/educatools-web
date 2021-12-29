const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, async(req, res) => {
    const tipoUsuario = req.user.tipo;
    if(tipoUsuario == "admin") {
        res.render('dashboard');
    } else {
        res.render('dashboard-simples');
    }

});

module.exports = router;