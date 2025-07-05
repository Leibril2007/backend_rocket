const User = require('../models/user.model');

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, avatar, rol, puntaje } = req.body;
    const nuevoUsuario = new User({ nombre, avatar, rol, puntaje });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await User.find({ rol: 'alumno' }).sort({ puntaje: -1 });
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
};
