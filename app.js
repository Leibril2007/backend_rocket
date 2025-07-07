const express = require('express');
const cors = require('cors');

const app = express();

// CORS con lista blanca
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5502',
      'http://localhost:5500',
      'http://localhost:5502'
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Montar rutas
app.use(require('./profesor/login.js'));
app.use(require('./profesor/partidas.js'));
app.use(require('./alumnos/jugadores.js'));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
