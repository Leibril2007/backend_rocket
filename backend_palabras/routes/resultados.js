const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/api/resultados', (req, res) => {
  const { nivel, puntaje, preguntas, vidas } = req.body;

  const sql = `
    INSERT INTO palabras_results (nivel, puntaje, preguntas, vidas)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nivel, puntaje, preguntas, vidas], (err, result) => {
    if (err) {
      console.error('❌ Error al guardar resultado:', err);
      return res.status(500).json({ error: 'Error al guardar resultado' });
    }

    res.status(201).json({ message: 'Resultado guardado correctamente' });
  });
});

module.exports = router;
