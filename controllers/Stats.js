class Stats {
  async postStats(req, res, next) {
    //
  }

  async getStats(req, res, next) {
    res.status(200).json({ message: 'stats dude' });
  }
}

module.exports = new Stats();
