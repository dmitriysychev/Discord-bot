const express = require('express');
const { log } = require('./src/common/logger');

const app = express();

app.get('/', (req, res) => {
  log.info({}, '-----HEALTH CHECK-----');
  res.send('Health check complete!');
});

module.exports = app;
