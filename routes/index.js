const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('layouts/principal');
})


module.exports = router;
