const Stat = require('../models/Stats');

class Stats {
  async postStats(req, res, next) {
    const { username, time, picks } = req.body;
    try {
      const post = await Stat.create({ username, time, picks });
      res.status(201).json({ post });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    res.status(200).json({ message: 'stats dude' });
  }
}

module.exports = new Stats();
