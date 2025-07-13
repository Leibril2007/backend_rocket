const modelo = require("../models/partidasModel");

module.exports = {
  crearPartida: async (req, res) => {
    try {
      await modelo.guardarPartida(req.body);
      res.status(201).json({ mensaje: "Partida guardada exitosamente 🎉" });
    } catch (err) {
      console.error("❌ Error al guardar partida:", err);
      res.status(500).json({ error: "No se pudo registrar la partida" });
    }
  },

  rankingGlobal: async (req, res) => {
    try {
      const ranking = await modelo.obtenerRanking();
      res.json(ranking);
    } catch (err) {
      console.error("❌ Error al obtener ranking:", err);
      res.status(500).json({ error: "No se pudo obtener el ranking" });
    }
  }
};
