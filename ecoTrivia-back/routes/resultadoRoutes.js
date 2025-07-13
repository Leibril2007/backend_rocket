const express = require('express');
const { guardarResultado, obtenerResultados, calcularRanking } = require('../controllers/resultadoController');

const router = express.Router();

router.post('/', guardarResultado);
router.get('/', obtenerResultados);
router.post('/ranking', calcularRanking);

module.exports = router;

