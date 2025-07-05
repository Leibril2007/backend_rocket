const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'luna1907',
  database: 'trivia'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión a la DB:', err);
  } else {
    console.log('✅ Base de datos conectada');
  }
});

module.exports = db;
