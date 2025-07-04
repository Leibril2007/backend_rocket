// DEPENDENCIAS
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// BASE DE DATOS ----------------------------------------------------------------------
const db = mysql.createPool({
  host: 'bnypomdjooi40fbyi0iz-mysql.services.clever-cloud.com',
  user: 'ufblh1sdfkvar8km',
  password: 'HfHWkNTpLzgi5D5bCqGK',
  database: 'bnypomdjooi40fbyi0iz',
  waitForConnections: true,
  connectionLimit: 7,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Conexión a la base de datos establecida');
    connection.release();
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
})();

// ENDPOINT DE PRUEBA
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// LOGIN
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  const sql = `
    SELECT usuario, correo, contraseña, id FROM profesores WHERE (usuario = ? OR correo = ?) AND contraseña = ?`;

  try {
    const [results] = await db.query(sql, [usuario, usuario, contraseña]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const usuarios = results[0];

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: usuarios.id,
        usuario: usuarios.usuario,
        correo: usuarios.correo
      }
    });
  } catch (err) {
    console.error('ERROR en la consulta de login:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


// CREAR JUGADOR (name + avatar)
// IMPORTANTE: Debes hacer ALTER TABLE para que avatar acepte emojis (utf8mb4)
app.post('/players', async (req, res) => {
  const { usuario, avatar } = req.body;

  if (!usuario || !avatar) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    // Verificar si el jugador ya existe
    const [existing] = await db.query('SELECT id FROM players WHERE name = ?', [usuario]);

    if (existing.length > 0) {
      return res.json({ success: true, id: existing[0].id });
    }

    // Insertar nuevo jugador con nombre y avatar
    const [result] = await db.query('INSERT INTO players(name, avatar) VALUES (?, ?)', [usuario, avatar]);

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Error creando player:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// CREAR PARTIDA
app.post('/partidas', async (req, res) => {
  const { codigo, estado, juego, nivel, tiempo } = req.body;

  const query = `INSERT INTO partidas(codigo, estado, juego, nivel, tiempo) VALUES (?,?,?,?,?)`;

  try {
    const [results] = await db.query(query, [codigo, estado, juego, nivel, tiempo]);

    res.status(201).json({
      id: results.insertId,
      codigo,
      estado,
      juego,
      nivel,
      tiempo
    });
  } catch (err) {
    console.error('ERROR EN PARTIDAS', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});


// AÑADIR JUGADOR A PARTIDA
// Se valida que la partida exista antes de insertar
app.post('/jugadores_partida', async (req, res) => {
  const { id_player, codigo_partida } = req.body;


  if (!id_player || !codigo_partida) {
    return res.status(400).json({ success: false, message: "Faltan requisitos" });
  }

  try {
    // Verifica si la partida existe
    const [partida] = await db.query('SELECT * FROM partidas WHERE codigo = ?', [codigo_partida]);

    if (partida.length === 0) {
      return res.status(404).json({ success: false, message: 'Código de partida no válido' });
    }

    const query = `
      INSERT INTO jugadores_partidas (id_player, codigo_partida)
      VALUES (?, ?)`;

    await db.query(query, [id_player, codigo_partida]);

    res.status(201).json({
      success: true,
      message: "Jugador añadido a la partida"
    });

  } catch (err) {
    console.error("ERROR EN jugadores_partida:", err);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// OBTENER JUGADORES POR CÓDIGO DE PARTIDA
app.get('/jugadores_partida/:codigo', async (req, res) => {
  const codigo_partida = req.params.codigo;

  const query = `
    SELECT p.id, p.name, p.avatar
    FROM players p
    INNER JOIN jugadores_partidas jp ON p.id = jp.id_player
    WHERE jp.codigo_partida = ?`;

  try {
    const [results] = await db.query(query, [codigo_partida]);
    res.json({ success: true, jugadores: results });
  } catch (err) {
    console.error('ERROR al obtener jugadores:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// INICIAR SERVIDOR --------------------------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
