require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const CORS = require('./middlewares/CORS');
const errorRoute = require('./middlewares/error-handler');

const app = express();

// helper routes
app.use(bodyParser.json());
app.use(CORS);

// custom routes
app.get('/', (req, res, next) => {
  res.send({ message: 'root route' });
});

// error handling
app.use(errorRoute);

app.listen(5000);
