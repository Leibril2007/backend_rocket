// DEPENDENCIAS
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// CORS – múltiples orígenes permitidos
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5502',
      'http://localhost:5500',
      'http://localhost:5502'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CONEXIÓN A BASE DE DATOS
const db = mysql.createPool({
  host: 'bnypomdjooi40fbyi0iz-mysql.services.clever-cloud.com',
  user: 'ufblh1sdfkvar8km',
  password: 'HfHWkNTpLzgi5D5bCqGK',
  database: 'bnypomdjooi40fbyi0iz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Conexión a la base de datos establecida');
    connection.release();
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
  }
})();

// ENDPOINT DE PRUEBA
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// LOGIN (SIN ENCRIPTACIÓN)
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  const sql = `
    SELECT id, usuario, correo, contraseña 
    FROM profesores 
    WHERE (usuario = ? OR correo = ?) AND contraseña = ?`;

  try {
    const [results] = await db.query(sql, [usuario, usuario, contraseña]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const user = results[0];

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        usuario: user.usuario,
        correo: user.correo
      }
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// REGISTRO (SIN ENCRIPTACIÓN)
app.post('/registro', async (req, res) => {
  const { usuario, correo, contraseña } = req.body;

  if (!usuario || !correo || !contraseña) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
  }

  try {
    const query = "INSERT INTO profesores(usuario, correo, contraseña) VALUES (?, ?, ?)";
    await db.query(query, [usuario, correo, contraseña]);

    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// CREAR PLAYER
app.post('/players', async (req, res) => {
  const { usuario, avatar } = req.body;

  if (!usuario || !avatar) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM players WHERE name = ?', [usuario]);

    if (existing.length > 0) {
      return res.json({ success: true, id: existing[0].id });
    }

    const [result] = await db.query('INSERT INTO players(name, avatar) VALUES (?, ?)', [usuario, avatar]);

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('❌ Error creando player:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// CREAR PARTIDA
app.post('/partidas', async (req, res) => {
  const { codigo, estado } = req.body;

  try {
    const [results] = await db.query('INSERT INTO partidas(codigo, estado) VALUES (?,?)', [codigo, estado]);

    res.status(201).json({
      id: results.insertId,
      codigo,
      estado
    });
  } catch (err) {
    console.error('ERROR EN PARTIDAS', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// AÑADIR JUGADOR A PARTIDA
app.post('/jugadores_partida', async (req, res) => {
  const { id_player, codigo_partida } = req.body;

  if (!id_player || !codigo_partida) {
    return res.status(400).json({ success: false, message: "Faltan requisitos" });
  }

  try {
    const [partida] = await db.query('SELECT * FROM partidas WHERE codigo = ?', [codigo_partida]);

    if (partida.length === 0) {
      return res.status(404).json({ success: false, message: 'Código de partida no válido' });
    }

    await db.query(
      'INSERT INTO jugadores_partidas (id_player, codigo_partida) VALUES (?, ?)',
      [id_player, codigo_partida]
    );

    res.status(201).json({
      success: true,
      message: "Jugador añadido a la partida"
    });

  } catch (err) {
    console.error("ERROR EN jugadores_partida:", err);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// OBTENER JUGADORES POR PARTIDA
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
    console.error('❌ ERROR al obtener jugadores:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// INICIAR SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
