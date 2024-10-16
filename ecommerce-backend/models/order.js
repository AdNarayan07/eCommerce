const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
const Order = sequelize.define('Orders', {
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    price: { type: DataTypes.INTEGER, allowNull: false },
    deliveryFee: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM("Placed", "Shipped", "Out for Delivery", "Delivered", "Cancelled by Seller", "Cancelled by Shopper") }
});
module.exports = Order;
