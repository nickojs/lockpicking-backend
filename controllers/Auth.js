const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = require('../helpers/generate-token');
const sendgrid = require('../helpers/sendgrid-mailer');
const { expirationDates, expirationMessage, isExpired } = require('../helpers/token-expiration');

const User = require('../models/User');
const ErrorHandler = require('../models/http-error');

class Auth {
  async signup(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const hashedPw = await bcrypt.hash(password, 12);
      const user = await User.create({ username, email, password: hashedPw });

      res.status(201).json({
        message: 'successfully created user',
        userId: user.id
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.getUserByUsername(username);
      const comparePw = await bcrypt.compare(password, user.password);

      if (!comparePw) throw new ErrorHandler('Wrong password', 401);

      const token = jwt.sign({
        userId: user.id
      }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async setAccountToken(req, res, next) {
    const { userId } = req.body;

    try {
      const user = await User.getUserById(userId);
      // checks for an existing, not expired token
      if (user.resetToken && !isExpired(user.resetTokenData)) {
        // eslint-disable-next-line no-unused-vars
        const [_, diff, sulfix] = expirationDates(user.resetTokenData);
        const message = expirationMessage(diff, sulfix);
        return res.status(200).json({ message });
      }
      // generates the token
      const resetToken = await generateToken(32);
      const [dateLimits, diff, sulfix] = expirationDates();
      const message = expirationMessage(diff, sulfix);
      // saves token and expiration date
      user.resetToken = resetToken;
      user.resetTokenData = dateLimits.expiration;
      await user.save();
      // sends mail with token to user
      sendgrid(user.email, {
        username: user.username,
        expiration: message,
        token: user.resetToken
      });
      res.status(201).json({
        message: 'Generated token. Check your email.'
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserData(req, res, next) {
    const { token } = req.params;
    try {
      const user = await User.getUserByToken(token);
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    const { token } = req.params;
    const { username, password, email } = req.body;
    try {
      const user = await User.getUserByToken(token);
      const oldName = user.username;
      await user.update({ username, password, email });
      res.status(201).json({ message: `Updated ${oldName} to ${username}` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
