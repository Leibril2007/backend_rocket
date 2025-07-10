const db = require('../db');

const guardarResultado = async (req, res) => {
  const { nivel, puntaje, preguntas, vidas } = req.body;

  try {
    const [resultado] = await db.execute(
      'INSERT INTO resultados_palabras (nivel, puntaje, preguntas, vidas) VALUES (?, ?, ?, ?)',
      [nivel, puntaje, preguntas, vidas]
    );
    res.status(201).json({
      id: resultado.insertId,
      message: '✅ Resultado guardado en resultados_palabras'
    });
  } catch (error) {
    console.error('❌ Error al guardar resultado:', error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

module.exports = { guardarResultado };
