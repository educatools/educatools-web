const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

router.get('/', ensureAuth, async (req, res) => {
  res.render('dashboard');
});

module.exports = router;