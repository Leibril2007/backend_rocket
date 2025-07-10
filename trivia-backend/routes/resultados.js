const express = require('express');
const router = express.Router();
const { connection: db } = require('../../config/base_datos');

router.post('/', async (req, res) => {
  const { nivel, puntaje, preguntas_jugadas, vidas_restantes } = req.body;

/*   console.log("📥 Resultado recibido:", req.body); */

  try {
    const [result] = await db.execute(
      'INSERT INTO resultados_dania (nivel, puntaje, preguntas_jugadas, vidas_restantes) VALUES (?, ?, ?, ?)',
      [nivel, puntaje, preguntas_jugadas, vidas_restantes]
    );
    res.status(201).json({ message: 'Resultado guardado exitosamente' });
  } catch (err) {
    console.error('🛑 Error al guardar resultado:', err.message);
    res.status(500).json({ 
      error: 'Error interno al guardar el resultado',
      detalle: err.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM resultados_dania ORDER BY fecha DESC LIMIT 10');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener resultados:', err);
    res.status(500).json({ error: 'Error al obtener los resultados' });
  }
});

module.exports = router;
