const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(require('./routes/resultados'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
