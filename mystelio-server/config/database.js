const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sequelize creates two fields createdAt and updatedAt so to maintain timezone for India timezone field is added

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: '+05:30', // Set the timezone to India Standard Time (IST)
});

module.exports = sequelize;
