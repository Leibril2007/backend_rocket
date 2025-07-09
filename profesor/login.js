const express = require('express');
const router = express.Router();
const { connection } = require('../config/base_datos');

// Endpoint de prueba
router.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

router.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  const sql = `
    SELECT id, usuario, correo, contraseña 
    FROM profesores 
    WHERE (usuario = ? OR correo = ?) AND contraseña = ?`;

  try {
    const [results] = await connection.query(sql, [usuario, usuario, contraseña]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const user = results[0];
    res.json({ success: true, message: 'Inicio de sesión exitoso', user });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

router.post('/registro', async (req, res) => {
  const { usuario, correo, contraseña } = req.body;

  if (!usuario || !correo || !contraseña) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
  }

  try {
    await connection.query("INSERT INTO profesores(usuario, correo, contraseña) VALUES (?, ?, ?)", [usuario, correo, contraseña]);
    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;
