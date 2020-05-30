const bodyParser = require('body-parser');
const CORS = require('./middlewares/CORS');
const errorHandler = require('./middlewares/error-handler');

const routes = require('./routes/route');

class Server {
  constructor(express) {
    this.express = express;
    this.app = this.express();
  }

  initDatabase(delay) {
    // db config
    // dummy promise
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  setMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(CORS);
  }

  setRoutes() {
    this.app.use(routes);
    this.app.use(errorHandler);
  }

  run(port) {
    this.app.listen(port || 5000);
  }
}

module.exports = Server;
