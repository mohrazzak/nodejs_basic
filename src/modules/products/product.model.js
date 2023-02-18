const { DataTypes } = require('sequelize');
const db = require('../../config/db');

const Products = db.define('Products', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL(10, 2),
  image_url: DataTypes.STRING,
  created_at: DataTypes.DATE,
});

module.exports = Products;
