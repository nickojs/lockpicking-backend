const express = require('express');
const { body } = require('express-validator');
const validateResult = require('../helpers/validate-routes');

const User = require('../models/User');
const Auth = require('../controllers/Auth');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post('/signup',
  [
    body('username').trim()
      .isLength({ min: 4, max: 18 })
      .withMessage('Invalid user length')
      .custom(async (value) => {
        const user = await User.findOne({ where: { username: value } });
        if (user) return Promise.reject();
      })
      .withMessage('Username already exists'),
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

router.post('/reset-password/', Auth.setResetPasswordToken);

router.post('/reset-password/:token',
  [
    body('password')
      .isLength({ min: 8, max: 20 })
      .withMessage('Invalid password length')
      .matches(/([0-9].*[a-zA-Z])|([a-zA-Z].*[0-9])/)
      .withMessage('Password should have at least one number and one char')
  ],
  validateResult.default,
  Auth.resetPassword);

router.post('/rename-user', isAuth, Auth.renameUser);

module.exports = router;
