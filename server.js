const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();

const app = express();

// CORS para desarrollo local
app.use(cors({
  origin: ['http://127.0.0.1:5502', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: false
}));

app.use(express.json());

// Middleware para registrar las rutas
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// Cargar modelos
require('./models/User');
require('./models/Partida');

// Verificar conexión con MySQL en Clever Cloud
sequelize.authenticate()
  .then(() => {
    console.log('🔗 Conexión a MySQL en Clever Cloud exitosa');
  })
  .catch(err => {
    console.error('⚠️ Error al conectar con la base de datos:', err);
  });

// Sincronizar los modelos con la base de datos
sequelize.sync()
  .then(() => console.log('✅ Base de datos conectada y tablas sincronizadas'))
  .catch(err => console.error('❌ Error al sincronizar la DB:', err));

// Rutas API
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/partidas', require('./routes/partida.routes'));

// Inicializar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
