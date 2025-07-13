const express = require('express');
const router = express.Router();
const { connection } = require('../config/base_datos');

router.post('/players', async (req, res) => {
  const { usuario, avatar } = req.body;

  if (!usuario || !avatar) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    const [existing] = await connection.query('SELECT id FROM players WHERE name = ?', [usuario]);
    if (existing.length > 0) {
      return res.json({ success: true, id: existing[0].id });
    }

    const [result] = await connection.query('INSERT INTO players(name, avatar) VALUES (?, ?)', [usuario, avatar]);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('❌ Error creando player:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

router.post('/jugadores_partida', async (req, res) => {
  const { id_player, codigo_partida } = req.body;

  if (!id_player || !codigo_partida) {
    return res.status(400).json({ success: false, message: "Faltan requisitos" });
  }

  try {
    const [partida] = await connection.query('SELECT * FROM partidas WHERE codigo = ?', [codigo_partida]);
    if (partida.length === 0) {
      return res.status(404).json({ success: false, message: 'Código de partida no válido' });
    }

    await connection.query('INSERT INTO jugadores_partidas (id_player, codigo_partida) VALUES (?, ?)', [id_player, codigo_partida]);
    res.status(201).json({ success: true, message: "Jugador añadido a la partida" });

  } catch (err) {
    console.error("ERROR EN jugadores_partida:", err);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

router.get('/jugadores_partida/:codigo', async (req, res) => {
  const codigo_partida = req.params.codigo;

  const query = `
    SELECT p.id, p.name, p.avatar
    FROM players p
    INNER JOIN jugadores_partidas jp ON p.id = jp.id_player
    WHERE jp.codigo_partida = ?`;

  try {
    const [results] = await connection.query(query, [codigo_partida]);
    res.json({ success: true, jugadores: results });
  } catch (err) {
    console.error('❌ ERROR al obtener jugadores:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

router.get('/jugadores_partidas', async (req, res) => {
  const query = `
    SELECT * FROM jugadores_partidas
  `;

  try {
    const [results] = await connection.query(query);

    res.json({
      success: true,
      jugadores_partidas: results,
    });
  } catch (err) {
    console.error('❌ ERROR al obtener jugadores_partidas:', err);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener los registros',
    });
  }
});

// Ruta para consultar si un jugador ya finalizó su partida
router.get('/jugador_finaliza/:codigo/:usuario', async (req, res) => {
  const { codigo, usuario } = req.params;

  try {
    // Buscar el id del jugador por nombre
    const [players] = await connection.query('SELECT id FROM players WHERE name = ?', [usuario]);
    if (players.length === 0) {
      return res.status(404).json({ success: false, message: 'Jugador no encontrado' });
    }
    const id_player = players[0].id;

    // Buscar el registro en jugadores_partidas
    const [registros] = await connection.query(
      'SELECT terminado FROM jugadores_partidas WHERE id_player = ? AND codigo_partida = ?',
      [id_player, codigo]
    );
    if (registros.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontró la partida para el jugador' });
    }
    const terminado = registros[0].terminado === 1 || registros[0].terminado === true;
    res.json({ success: true, terminado });
  } catch (err) {
    console.error('❌ ERROR al consultar si jugador finalizó:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;
