const routes = require('./routes/index');
const express = require('express');

const app = express();
app.use('/', routes);

module.exports = app;
