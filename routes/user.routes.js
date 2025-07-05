const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    console.log('📥 Datos recibidos:', req.body);
    const nuevoUsuario = await User.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { codigo_partida } = req.query;
    const usuarios = await User.findAll({
      where: { codigo_partida, rol: 'estudiante' },
      order: [['puntos', 'DESC']]
    });
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

router.put('/:id/resultados', async (req, res) => {
  try {
    const { aciertos, errores, puntos, tiempo_segundos } = req.body;
    console.log('🧠 ID recibido:', req.params.id);
    console.log('📦 Resultados:', req.body);

    const usuario = await User.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.update({ aciertos, errores, puntos, tiempo_segundos });
    res.json(usuario);
  } catch (error) {
    console.error('❌ Error al actualizar resultados:', error);
    res.status(500).json({ mensaje: 'Error al guardar resultados' });
  }
});

module.exports = router;
