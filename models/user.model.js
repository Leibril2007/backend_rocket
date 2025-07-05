const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.STRING, allowNull: false },
  aciertos: { type: DataTypes.INTEGER, defaultValue: 0 },
  errores: { type: DataTypes.INTEGER, defaultValue: 0 },
  observaciones: { type: DataTypes.TEXT }
}, {
  tableName: 'users'
});

module.exports = User;
