const express = require('express');
const { body } = require('express-validator');
const validateResult = require('../helpers/validate-routes');

const User = require('../models/User');
const Auth = require('../controllers/Auth');
const router = express.Router();

// write your routes here
router.get('/', (req, res, next) => {
  res.send({ message: 'root route' });
});

router.post('/new-user',
  [
    body('username').trim()
      .isLength({ min: 4, max: 18 })
      .withMessage('Invalid user length'),
    body('password')
      .isLength({ min: 8, max: 20 })
      .withMessage('Invalid password length')
      .matches(/([0-9].*[a-zA-Z])|([a-zA-Z].*[0-9])/)
      .withMessage('Password should have at least one number and one char'),
    body('email').trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email')
      .custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) return Promise.reject();
      })
      .withMessage('Email already exists')
  ],
  validateResult.default,
  Auth.signup);

router.post('/login', body('username').trim(), Auth.login);

module.exports = router;
