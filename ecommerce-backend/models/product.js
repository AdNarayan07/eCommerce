const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  shortDescription: { type: DataTypes.STRING, allowNull: true },
  detailedDescription: { type: DataTypes.STRING, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  seller: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Product;
