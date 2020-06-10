const Sequelize = require('sequelize');
const database = require('../config/database');
const ErrorHandler = require('./http-error');
const { isExpired } = require('../helpers/token-expiration');

const User = database.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  resetToken: Sequelize.STRING,
  resetTokenData: Sequelize.DATE
}, { tableName: 'users' });

User.getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new ErrorHandler('Couldn\'t find user', 404);
  return user;
};

User.getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorHandler('Couldn\'t find user', 404);
  return user;
};

User.getUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new ErrorHandler('Couldn\'t find user', 404);
  return user;
};

User.getUserByToken = async (resetToken) => {
  const user = await User.findOne({ where: { resetToken } });
  if (!user) throw new ErrorHandler('Invalid token', 404);
  if (isExpired(user.resetTokenData)) throw new ErrorHandler('Invalid token', 401);

  return user;
};

module.exports = User;
