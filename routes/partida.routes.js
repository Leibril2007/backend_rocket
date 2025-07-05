const express = require('express');
const router = express.Router();
const Partida = require('../models/Partida');

router.post('/', async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo || typeof codigo !== 'string' || !codigo.trim()) {
      return res.status(400).json({ mensaje: 'El código es obligatorio y debe ser una cadena válida' });
    }

    const nuevaPartida = await Partida.create({ codigo: codigo.trim(), activa: true });
    res.status(201).json(nuevaPartida);
  } catch (error) {
    console.error('❌ Error al crear partida:', error.message);
    res.status(500).json({ mensaje: 'Error al crear partida' });
  }
});

router.get('/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;

    if (!codigo || typeof codigo !== 'string' || !codigo.trim()) {
      return res.status(400).json({ mensaje: 'Debes proporcionar un código válido' });
    }

    const partida = await Partida.findOne({ where: { codigo: codigo.trim() } });

    if (!partida) {
      return res.status(404).json({ mensaje: 'Partida no encontrada para ese código' });
    }

    res.status(200).json(partida);
  } catch (error) {
    console.error('❌ Error al buscar partida:', error.message);
    res.status(500).json({ mensaje: 'Error interno al verificar partida' });
  }
});

router.get('/verificar/todos', async (req, res) => {
  try {
    const partidas = await Partida.findAll();
    res.status(200).json({ mensaje: 'Datos recibidos correctamente', partidas });
  } catch (error) {
    console.error('❌ Error al verificar datos:', error.message);
    res.status(500).json({ mensaje: 'No se pudo verificar los datos' });
  }
});

module.exports = router;
