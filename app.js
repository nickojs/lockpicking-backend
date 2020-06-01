require('dotenv').config();
const express = require('express');
const Server = require('./server');

const server = new Server(express);

server.initDatabase()
  .then(() => {
    console.log('connected to the database!');
    server.setMiddlewares();
    server.setRoutes();
    server.run(5000);
  })
  .catch((err) => console.log('error: ', err));
