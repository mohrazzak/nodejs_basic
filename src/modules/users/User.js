const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const User = db.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: { type: DataTypes.STRING, allowNull: false },

  isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = User;
