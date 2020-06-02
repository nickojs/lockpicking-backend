const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = require('../helpers/generate-token');
const { expirationDates, expirationMessage } = require('../helpers/token-expiration');

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

    try {
      const user = await User.getUserByUsername(username);
      if (user.resetToken) {
        const [_, diff, sulfix] = expirationDates(user.resetTokenData);
        const message = expirationMessage(diff, sulfix);
        return res.status(200).json({
          message,
          resetToken: user.resetToken
        });
      }

      const resetToken = await generateToken(32);
      const [dateLimits, diff, sulfix] = expirationDates();
      const message = expirationMessage(diff, sulfix);

      user.resetToken = resetToken;
      user.resetTokenData = dateLimits.expiration;
      await user.save();
      res.status(201).json({ message, resetToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();

/* READ ME!!!!!!!!!
  I won't make the "setResetPasswordToken" available until I get
  a mailing api to deliver the token to the user's email

  It would be a gigantic security flaw to deliver the token
  in the response, anyone could reset other users password

*/
