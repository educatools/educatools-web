const express = require('express');
const GerenciadorUsuarios = require('../servicos/GerenciadorUsuarios');
const router = express.Router();

router.get("/email/:email", async(req, res) => {
  try {
    const emailExiste = await GerenciadorUsuarios.emailJaCadastrado(req.params.email);
    if(emailExiste) res.sendStatus(200);
    else res.sendStatus(404);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;