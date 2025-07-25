const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5502',
      'http://localhost:5500',
      'http://localhost:5502',
      'https://frontend-rocket-play.onrender.com'
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

// PROFESOR
app.use(require('./profesor/login.js'));
app.use(require('./profesor/partidas.js'));
app.use(require('./alumnos/jugadores.js'));
//app.use(require('./profesor/tiempo.js'));

// RUTA ECOTRIVIA
app.use('/api/resultados', require('./ecoTrivia-back/routes/resultadoRoutes'));

//RUTA LABERINTO
app.use('/laberinto', require('./laberinto-back/routes/partidasLaberinto.js'));

//RUTA TRIVIA
app.use('/api/resultadosDania', require('./trivia-backend/routes/resultados.js'));

//RUTA EMOJI
app.use('/api/partidas', require('./emoji/routes/partidas.js'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
