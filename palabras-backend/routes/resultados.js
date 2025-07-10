const express = require('express');
const router = express.Router();
const { guardarResultado } = require('../controllers/resultadosController');

router.post('/', guardarResultado);

module.exports = router;
