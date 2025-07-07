const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'bnypomdjooi40fbyi0iz-mysql.services.clever-cloud.com',
  user: 'ufblh1sdfkvar8km',
  password: 'HfHWkNTpLzgi5D5bCqGK',
  database: 'bnypomdjooi40fbyi0iz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificación de conexión (una vez al arrancar)
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ Conexión a la base de datos establecida');
    conn.release();
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
  }
})();

module.exports = db;
