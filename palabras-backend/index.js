const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const resultadosRoutes = require('./routes/resultados');

app.use(cors());
app.use(express.json());
app.use('/api/resultados', resultadosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
