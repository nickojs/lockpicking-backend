const express = require('express');
const { body } = require('express-validator');
const validateResult = require('../helpers/validate-routes');

const router = express.Router();
const Auth = require('../controllers/Auth');

// write your routes here
router.get('/', (req, res, next) => {
  res.send({ message: 'root route' });
});

router.post('/new-user', Auth.signup);

module.exports = router;
