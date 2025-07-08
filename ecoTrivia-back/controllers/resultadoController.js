const { connection } = require('../../config/base_datos');

async function guardarResultado(req, res) {
  try {
    let { nombre, puntaje, nivel, preguntas_jugadas } = req.body;

    nombre = typeof nombre === 'string' && nombre.trim() !== '' ? nombre.trim() : 'Anónimo';

    if (
      typeof puntaje !== 'number' ||
      typeof nivel !== 'number' ||
      typeof preguntas_jugadas !== 'number'
    ) {
      return res.status(400).json({ error: 'Datos inválidos o incompletos' });
    }

    const [resultado] = await connection.query(
      'INSERT INTO resultados (nombre, puntaje, nivel, preguntas_jugadas) VALUES (?, ?, ?, ?)',
      [nombre, puntaje, nivel, preguntas_jugadas]
    );

    return res.status(201).json({
      id: resultado.insertId,
      mensaje: '✅ Resultado guardado con éxito'
    });
  } catch (error) {
    console.error('Error guardando resultado:', error.sqlMessage || error.message);
    res.status(500).json({ error: error.sqlMessage || error.message });
  }
}

async function obtenerResultados(req, res) {
  try {
    const [resultados] = await connection.query(
      'SELECT nombre, puntaje, nivel, preguntas_jugadas, fecha FROM resultados ORDER BY puntaje DESC, fecha DESC LIMIT 10'
    );

    if (!resultados || resultados.length === 0) {
      return res.status(200).json({ mensaje: 'No hay resultados registrados aún' });
    }

    return res.json(resultados);
  } catch (error) {
    console.error('❌ Error obteniendo resultados:', error.sqlMessage || error.message);
    return res.status(500).json({ error: 'Error al obtener resultados' });
  }
}


module.exports = {
  guardarResultado,
  obtenerResultados
};
