const bodyParser = require('body-parser');
const CORS = require('./middlewares/CORS');
const errorHandler = require('./middlewares/error-handler');

const database = require('./config/database');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');

class Server {
  constructor(express) {
    this.express = express;
    this.app = this.express();
  }

  initDatabase() {
    return database.sync({ /* force: true  */});
  }

  setMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(CORS);
  }

  setRoutes() {
    this.app.get('/', (req, res, next) => {
      res.status(200).json({ message: 'we are up!' });
    });
    this.app.use(statsRoutes);
    this.app.use('/auth', authRoutes);
    this.app.use(errorHandler);
  }

  run(port) {
    this.app.listen(port, () => {
      console.log(`Connected on port: ${port}`);
    });
  }
}

module.exports = Server;
