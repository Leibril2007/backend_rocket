const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/', (req, res) => {
  const { nivel, puntaje, preguntas_jugadas, vidas_restantes } = req.body;

  console.log("📥 Resultado recibido:", req.body);

  const query = 'INSERT INTO resultados (nivel, puntaje, preguntas_jugadas, vidas_restantes) VALUES (?, ?, ?, ?)';
  db.query(query, [nivel, puntaje, preguntas_jugadas, vidas_restantes], (err, result) => {
    if (err) {
      console.error('🛑 Error al guardar resultado:', err);
      return res.status(500).json({ 
        error: 'Error interno al guardar el resultado',
        detalle: err.message  // Mostramos la causa exacta para debug
      });
    }
    res.status(201).json({ message: 'Resultado guardado exitosamente' });
  });
});

router.get('/', (req, res) => {
  const query = 'SELECT * FROM resultados ORDER BY fecha DESC LIMIT 10';
  db.query(query, (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener resultados:', err);
      return res.status(500).json({ error: 'Error al obtener los resultados' });
    }
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { nivel, puntaje, preguntas_jugadas, vidas_restantes } = req.body;

  console.log("📥 Resultado recibido:", req.body);

  const query = 'INSERT INTO resultados (nivel, puntaje, preguntas_jugadas, vidas_restantes) VALUES (?, ?, ?, ?)';
  db.query(query, [nivel, puntaje, preguntas_jugadas, vidas_restantes], (err, result) => {
    if (err) {
      console.error('🛑 Error al guardar resultado:', err.message); // MUY importante este .message
      return res.status(500).json({ 
        error: 'Error interno al guardar el resultado',
        detalle: err.message
      });
    }
    res.status(201).json({ message: 'Resultado guardado exitosamente' });
  });
});


module.exports = router;
