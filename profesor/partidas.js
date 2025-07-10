const express = require('express');
const router = express.Router();
const { connection } = require('../config/base_datos');


/* router.post('/partidas', async(req, res) => {

  const { codigo, estado, juego, nivel, tiempo } = req.body;

  const query = `INSERT INTO partidas(codigo, estado, juego, nivel, tiempo) VALUES (?,?,?,?,?)`;

  try{

    const [results] = await connection.query(query, [codigo, estado, juego, nivel, tiempo]);

    res.status(201).json({
      id: results.insertId,
      codigo, 
      estado,
      juego,
      nivel,
      tiempo

    })

  } catch (err) {
    console.error('ERROR EN PARTIDAS', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }

}); */

router.post('/partidas', async (req, res) => {
  const { codigo, estado, juego, niveles, tiempo } = req.body; // ← "niveles" en lugar de "nivel"

  const query = `INSERT INTO partidas (codigo, estado, juego, niveles, tiempo) VALUES (?, ?, ?, ?, ?)`;

  try {
    const [results] = await connection.query(query, [codigo, estado, juego, niveles, tiempo]);

    res.status(201).json({
      id: results.insertId,
      codigo,
      estado,
      juego,
      niveles,  // ← devuelves los niveles seleccionados como string tipo "1,2,4"
      tiempo
    });
  } catch (err) {
    console.error('ERROR EN PARTIDAS', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});



// ACTUALIZAR PARTIDA
router.put('/partidasEstadoCambio/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const { estado } = req.body;

/*   console.log("cod", codigo, "est", estado); */

  try {
    const [[partida]] = await connection.query(`SELECT id FROM partidas WHERE codigo = ?`, [codigo]);

    if (!partida) {
      return res.status(404).json({ success: false, message: 'Partida no encontrada' });
    }

    const [conteo] = await connection.query(
      `SELECT COUNT(*) AS total FROM jugadores_partidas WHERE codigo_partida = ?`,
      [codigo]
    );

    if (conteo[0].total < 1) {
      return res.status(400).json({ success: false, message: 'No hay jugadores conectados aún' });
    }

    const [result] = await connection.query(
      `UPDATE partidas SET estado = ? WHERE codigo = ?`,
      [estado, codigo]
    );

    res.json({ success: true, message: 'Estado actualizado', codigo, estado });
  } catch (err) {
    console.error('ERROR AL ACTUALIZAR ESTADO', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


/* INICIAR PARTIDA PARA ALUMNOS */

router.get('/partidas/inicio', async (req, res) => {
  const codigo_partida = req.query.codigo;

  if (!codigo_partida) {
    return res.status(400).json({ success: false, message: 'Falta el código de partida' });
  }

  try {
    const [partida] = await connection.query(
      `SELECT estado FROM partidas WHERE codigo = ?`,
      [codigo_partida]
    );

    if (!partida.length) {
      return res.status(404).json({ success: false, message: 'Partida no encontrada' });
    }

    const estado = partida[0].estado === 'true';

    if (!estado) {
      return res.json({ success: true, estado: false, jugadores: [] });
    }

    const [jugadores] = await connection.query(
      `SELECT p.id, p.name, p.avatar
       FROM players p
       INNER JOIN jugadores_partidas jp ON p.id = jp.id_player
       WHERE jp.codigo_partida = ?`,
      [codigo_partida]
    );

    return res.json({ success: true, estado: true, jugadores });

  } catch (err) {
    console.error('❌ ERROR al obtener partida:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// ELECCION DE JUEGO
  
router.get('/partidas/juegoPorProfe/:codigoPartida', async (req, res) => {
  const { codigoPartida } = req.params;

  try {
    const [juegoSel] = await connection.query(
      `SELECT estado, juego FROM partidas WHERE codigo = ?`,
      [codigoPartida]
    );

    if (!juegoSel.length) {
      return res.status(404).json({ success: false, message: 'Juego no encontrado' });
    }

    return res.json({
      success: true,
      estado: juegoSel[0].estado,
      juego: juegoSel[0].juego
    });

  } catch (err) {
    console.error('❌ ERROR al DAR JUEGO ELEGIDO:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});
 


module.exports = router;
