const express = require('express');
const { guardarResultado, obtenerResultados } = require('../controllers/resultadoController');

const router = express.Router();

router.post('/', guardarResultado);
router.get('/', obtenerResultados);

module.exports = router;

