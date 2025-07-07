const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const resultadosRouter = require('./routes/resultados');
app.use('/resultados', resultadosRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🛰️ Servidor corriendo en http://localhost:${PORT}`);
});
