const Sequelize = require('sequelize');
const database = require('../config/database');
// const ErrorHandler = require('./http-error');

const Stats = database.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  time: Sequelize.STRING,
  picks: Sequelize.STRING

}, { tableName: 'stats' });

module.exports = Stats;
