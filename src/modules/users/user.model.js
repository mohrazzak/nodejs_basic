const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const User = db.define('Users', {
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
  resetToken: { type: DataTypes.STRING, defaultValue: null },
});

module.exports = User;
