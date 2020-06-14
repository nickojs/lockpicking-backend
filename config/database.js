const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: `/cloudsql/${process.env.DB_HOST}`,
    dialectOptions: {
      socketPath: `/cloudsql/${process.env.DB_HOST}`
    }
  }
);

module.exports = sequelize;
