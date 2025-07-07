const express = require('express');
const router = express.Router();
const db = require('../config/base_datos');

router.post('/partidas', async (req, res) => {
  const { codigo, estado } = req.body;

  try {
    const [results] = await db.query('INSERT INTO partidas(codigo, estado) VALUES (?,?)', [codigo, estado]);
    res.status(201).json({ id: results.insertId, codigo, estado });
  } catch (err) {
    console.error('ERROR EN PARTIDAS', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;
