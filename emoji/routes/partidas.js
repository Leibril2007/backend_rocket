const express = require("express");
const router = express.Router();
const controlador = require("../controllers/partidasController");

router.post("/", controlador.crearPartida);
router.get("/ranking", controlador.rankingGlobal);

module.exports = router;
