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

// CONEXIONES ------------------------------------------------------------------------------------

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


app.post('/partidas', async(req, res) => {

  const { codigo, estado } = req.body;

  const query = `INSERT INTO partidas(codigo, estado) VALUES (?,?)`;

  try{

    const [results] = await db.query(query, [codigo, estado]);

    res.status(201).json({
      id: results.insertId,
      codigo, 
      estado

    })

  } catch (err) {
    console.error('ERROR EN PARTIDAS', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }


});



//------------------------------------------------------------------------------------

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;