const { connection } = require('../../config/base_datos');

// ✅ GUARDAR resultado
const guardarResultado = async (req, res) => {
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

    // Insertar resultado
    const [insertResult] = await connection.query(
      'INSERT INTO resultados (nombre, puntaje, nivel, preguntas_jugadas) VALUES (?, ?, ?, ?)',
      [nombre, puntaje, nivel, preguntas_jugadas]
    );

    const insertId = insertResult.insertId;

    // Calcular posición en ranking
    const [posicionResult] = await connection.query(
      `SELECT COUNT(*) + 1 AS posicion
       FROM resultados
       WHERE puntaje > ? 
          OR (puntaje = ? AND id < ?)`,
      [puntaje, puntaje, insertId]
    );

    const posicion = posicionResult[0]?.posicion || 1;

    return res.status(201).json({
      id: insertId,
      mensaje: '✅ Resultado guardado con éxito',
      posicion
    });

  } catch (error) {
    console.error('Error guardando resultado:', error.sqlMessage || error.message);
    return res.status(500).json({ error: error.sqlMessage || error.message });
  }
};

// ✅ OBTENER los 10 mejores resultados
const obtenerResultados = async (req, res) => {
  try {
    const [resultados] = await connection.query(
      'SELECT nombre, puntaje, nivel, preguntas_jugadas, fecha FROM resultados ORDER BY puntaje DESC, fecha DESC LIMIT 10'
    );

    if (!resultados || resultados.length === 0) {
      return res.status(200).json({ mensaje: 'No hay resultados registrados aún' });
    }

    return res.json(resultados);
  } catch (error) {
    console.error('Error obteniendo resultados:', error.sqlMessage || error.message);
    return res.status(500).json({ error: 'Error al obtener resultados' });
  }
};

// ✅ NUEVO: CALCULAR posición en ranking sin guardar
const calcularRanking = async (req, res) => {
  try {
    const { puntaje } = req.body;

    if (typeof puntaje !== 'number') {
      return res.status(400).json({ error: 'Puntaje inválido' });
    }

    const [result] = await connection.query(
      `SELECT COUNT(*) + 1 AS posicion 
       FROM resultados 
       WHERE puntaje > ?`,
      [puntaje]
    );

    const posicion = result[0]?.posicion || 1;

    return res.status(200).json({ posicion });
  } catch (error) {
    console.error('❌ Error calculando ranking:', error.sqlMessage || error.message);
    return res.status(500).json({ error: 'Error al calcular ranking' });
  }
};


module.exports = {
  guardarResultado,
  obtenerResultados,
  calcularRanking
};
