const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.LOCAL_DB
    // host: '/cloudsql/lockpicking:southamerica-east1:lockpicking',
    // dialectOptions: {
    //   socketPath: '/cloudsql/lockpicking:southamerica-east1:lockpicking'
    // }
  }
);

module.exports = sequelize;
