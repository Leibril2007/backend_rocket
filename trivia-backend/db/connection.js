const mysql = require('mysql2');
require('dotenv').config(); // Cargar las variables de entorno del .env

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión a la DB:', err);
  } else {
    console.log('✅ Conectado a la base de datos de Clever Cloud');
  }
});

module.exports = db;
