const bcrypt = require('bcrypt');

class Auth {
  async signup(req, res, next) {
    try {
      const { email, name, password } = req.body;
      const hashedPw = await bcrypt.hash(password, 12);
      // create user by model

      res.status(201).json({
        message: 'successfully created user'
        // userId: user.id
      });
    } catch (error) {
      next(error);
    }
  }
}
