const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = require('../helpers/generate-token');
const expirationDates = require('../helpers/token-expiration');

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

    const resetToken = await generateToken(32);
    const [dateLimits, diff, sulfix] = expirationDates();

    const message = `Your token expires in ${diff.hours} ${sulfix.hours}`
    + ` and ${diff.seconds} ${sulfix.seconds}.`;

    try {
      const user = await User.getUserByUsername(username);
      user.resetToken = resetToken;
      user.resetTokenData = dateLimits.expiration;
      await user.save();
      // the token should be sent to the users email, but sendgrid hates me
      // so i'll just return the reset token to the front-end
      res.status(201).json({ message, resetToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
