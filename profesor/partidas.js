const express = require('express');
const router = express.Router();
const { connection } = require('../config/base_datos');


router.post('/partidas', async(req, res) => {

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

});



// ACTUALIZAR PARTIDA 
router.put('/partidasEstadoCambio/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { estado } = req.body;
  
    const query = `UPDATE partidas SET estado = ? WHERE codigo = ?`;
  
    try {
      const [result] = await connection.query(query, [estado, codigo]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Partida no encontrada' });
      }
  
      res.json({ success: true, message: 'Estado actualizado', codigo, estado });
    } catch (err) {
      console.error('ERROR AL ACTUALIZAR ESTADO', err);
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  });


/* PARTIDA INICIAR PARA ALUMNOS */

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

  
  


module.exports = router;
