// partidasModel.js
const {connection} = require('../../config/base_datos'); 

module.exports = {
  guardarPartida: async ({ aciertos, fallos, tiempo_total, ranking }) => {
    const sql = `
      INSERT INTO partidas_emoji (aciertos, fallos, tiempo_total, ranking)
      VALUES (?, ?, ?, ?)
    `;
    await connection.execute(sql, [aciertos, fallos, tiempo_total, ranking]);
  },

  obtenerRanking: async () => {
    const [rows] = await connection.execute(`
      SELECT aciertos, fallos, tiempo_total, ranking
      FROM partidas_emoji
      ORDER BY aciertos DESC, tiempo_total ASC
      LIMIT 10
    `);
    return rows;
  }
};

