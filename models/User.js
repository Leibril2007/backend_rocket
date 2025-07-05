const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.STRING, allowNull: false },
  aciertos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  errores: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  puntos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  tiempo_segundos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  observaciones: { type: DataTypes.TEXT, allowNull: true },
  codigo_partida: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = User;
