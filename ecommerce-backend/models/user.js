const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  displayname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: 10 } },
  address: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("admin", "seller", "shopper"), defaultValue: "shopper" },
});

module.exports = User;
