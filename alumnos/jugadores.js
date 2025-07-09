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

module.exports = router;
