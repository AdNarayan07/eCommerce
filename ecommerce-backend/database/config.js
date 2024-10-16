const { Sequelize } = require('sequelize');
const path = require("path");

// Create a new instance of Sequelize for SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, "database.sqlite"), // Path to the SQLite file
  logging: false
});

// Export the instance for use in other parts of the application
module.exports = sequelize;