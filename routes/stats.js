const express = require('express');
const { body, checkSchema } = require('express-validator');
const validateResult = require('../helpers/validate-routes');

const Stats = require('../controllers/Stats');

const router = express.Router();

router.get('/stats', Stats.getStats);

router.post('/stats', Stats.postStats);

module.exports = router;
