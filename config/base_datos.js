const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'bnypomdjooi40fbyi0iz-mysql.services.clever-cloud.com',
  user: 'ufblh1sdfkvar8km',
  password: 'HfHWkNTpLzgi5D5bCqGK',
  database: 'bnypomdjooi40fbyi0iz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificación de conexión
(async () => {
  try {
    const conn = await connection.getConnection();
    console.log('✅ Conexión a la base de datos establecida');
    conn.release();
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
  }
})();

module.exports = { connection };
