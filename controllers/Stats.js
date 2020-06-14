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
    try {
      // gets last 10 rows from the stats, in the future will receive
      // query params and fetch those params
      const stats = await Stat.findAll({ limit: 10, order: [['createdAt', 'DESC']] });
      if (stats.length <= 0) {
        res.status(404).json({ message: 'could not find any stats' });
      }
      res.status(200).json({ records: stats });
    } catch (error) {
      next(error);
    }
    res.status(200).json({ message: 'stats dude' });
  }
}

module.exports = new Stats();
