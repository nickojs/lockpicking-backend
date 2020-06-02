const util = require('util');
const crypto = require('crypto');
const moment = require('moment');

const randomBytes = util.promisify(crypto.randomBytes);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  async setResetPasswordToken(req, res, next) {
    const { username } = req.body;

    const tokenBuf = await randomBytes(32);
    const token = tokenBuf.toString('hex');
    const timer = moment().add(1, 'hour').format();

    try {
      const user = await User.getUserByUsername(username);
      user.resetToken = token;
      user.resetTokenData = timer;
      await user.save();
      res.status(201).json({ message: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
