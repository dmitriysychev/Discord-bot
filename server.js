const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Health check complete!')
})

module.exports = app;
