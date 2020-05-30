const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validateResult = require('../helpers/validate-routes');

// write your routes here
router.get('/', (req, res, next) => {
  res.send({ message: 'root route' });
});

module.exports = router;
