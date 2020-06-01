const bcrypt = require('bcrypt');

class Auth {
  async signup(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const hashedPw = await bcrypt.hash(password, 12);

      const user = { email, username, password };

      res.status(201).json({
        message: 'successfully created user',
        user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Auth();
