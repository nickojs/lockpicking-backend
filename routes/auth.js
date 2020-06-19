const express = require('express');
const { body, checkSchema } = require('express-validator');
const validateResult = require('../helpers/validate-routes');

const Auth = require('../controllers/Auth');
const { signupSchema } = require('../validators/auth');

const router = express.Router();

router.post('/signup',
  checkSchema(signupSchema),
  validateResult.default,
  Auth.signup);

router.post('/login',
  body('username').trim(),
  Auth.login);

router.post('/request-token/',
  body('email').trim().isEmail()
    .withMessage('Provide a valid email'),
  validateResult.default,
  Auth.setAccountToken);

router.get('/update-user/:token', Auth.getUserData);

router.put('/update-user/',
  checkSchema(signupSchema),
  validateResult.default,
  Auth.updateUser);

router.delete('/delete-user/',
  body(['token', 'password']).not().isEmpty()
    .withMessage('invalid credentials'),
  validateResult.default,
  Auth.deleteUser);

module.exports = router;
