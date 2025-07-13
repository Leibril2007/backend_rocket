const express = require('express');
const router = express.Router();
const { connection } = require('../config/base_datos');


// ESTADO DE PARTIDA (TIEMPO Y NIVEL SIMULADO)
let partidasTiempo = {}; // clave: código, valor: { tiempo, nivel }

setInterval(() => {
  for (const codigo in partidasTiempo) {
    partidasTiempo[codigo].tiempo++;
    if (partidasTiempo[codigo].tiempo % 30 === 0) {
      partidasTiempo[codigo].nivel++;
    }
  }
}, 1000);

router.get('/estado-juego/:codigo', (req, res) => {
    const codigo = req.params.codigo;
  
    if (!partidasTiempo[codigo]) {
      return res.status(404).json({ success: false, message: 'Partida no encontrada' });
    }
  
    const { tiempo, nivel } = partidasTiempo[codigo];
    res.json({ success: true, tiempo, nivel });
});

  
module.exports = router;