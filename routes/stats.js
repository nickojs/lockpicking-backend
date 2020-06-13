const express = require('express');
const Stats = require('../controllers/Stats');

const router = express.Router();

router.get('/stats', Stats.getStats);

router.post('/stats', Stats.postStats);

module.exports = router;
