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

    const startTime = moment();
    const expiresIn = moment().add(1, 'hour'); // 1 hour from now
    const diff = moment.duration(expiresIn.diff(startTime));

    const timeDiff = {
      seconds: diff.get('seconds'),
      hours: diff.get('hours')
    };

    const timeSulfix = {
      hours: timeDiff.hours > 1 ? 'hours' : 'hour',
      seconds: timeDiff.seconds > 1 ? 'seconds' : 'second'
    };

    try {
      const user = await User.getUserByUsername(username);
      user.resetToken = token;
      user.resetTokenData = expiresIn;
      await user.save();
      // the token should be sent to the users email, but sendgrid hates me
      // so i'll just return the reset token to the front-end
      res.status(201).json({
        message: `Your token expires in ${timeDiff.hours} ${timeSulfix.hours} and ${timeDiff.seconds} ${timeSulfix.seconds}.`,
        resetToken: token
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
