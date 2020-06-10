/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = require('../helpers/generate-token');

const {
  mailToken,
  mailNewUser,
  mailUpdatedUser,
  mailDeletedUser
} = require('../helpers/sendgrid-mailer');

const {
  expirationDates,
  countdownMsg,
  dateExpirationMsg,
  isExpired
} = require('../helpers/token-expiration');

const User = require('../models/User');
const ErrorHandler = require('../models/http-error');

class Auth {
  async signup(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const hashedPw = await bcrypt.hash(password, 12);
      const user = await User.create({ username, email, password: hashedPw });

      mailNewUser(user.email, { username });

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
    const { email } = req.body;

    try {
      const user = await User.getUserByEmail(email);

      // checks for an existing, not expired token
      if (user.resetToken && !isExpired(user.resetTokenData)) {
        const [_, diff, sulfix] = expirationDates(user.resetTokenData);
        const message = countdownMsg(diff, sulfix);
        return res.status(200).json({ message });
      }

      // generates the token
      const resetToken = await generateToken(32);
      const [dateLimits] = expirationDates();
      const expiration = dateExpirationMsg(dateLimits.expiration);

      // saves token and expiration date
      user.resetToken = resetToken;
      user.resetTokenData = dateLimits.expiration;
      await user.save();

      // sends mail with token to user
      mailToken(user.email, {
        username: user.username,
        expiration,
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
    const {
      username, password, email, token
    } = req.body;

    try {
      const user = await User.getUserByToken(token);
      const hashedPw = password && await bcrypt.hash(password, 12);

      const currentUser = {
        username: user.username,
        email: user.email
      };
      const newUser = {
        username,
        email
      };

      await user.update({
        username,
        email,
        password: hashedPw,
        resetToken: null,
        resetTokenData: null
      });

      mailUpdatedUser(email, {
        currentUser,
        newUser
      });

      res.status(201).json({ message: 'Updated user information' });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    const { password, token } = req.body;
    try {
      const user = await User.getUserByToken(token);

      const comparePw = await bcrypt.compare(password, user.password);
      if (!comparePw) throw new ErrorHandler('Wrong password', 401);

      const { username, email } = user;

      mailDeletedUser(email, { username });
      res.status(201).json({ message: `Deleted user ${username}` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
