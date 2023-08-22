require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const applyMiddleware = require('./middleware/index');

//express app
const app = express();

applyMiddleware(app);

app.get('/health', (req, res) => {
  res.status(200).json({
    health: 'OK',
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

let connectionURL = process.env.DB_CONNECTION_URL;
connectionURL = connectionURL.replace('<username>', process.env.DB_USERNAME);
connectionURL = connectionURL.replace('<password>', process.env.DB_PASSWORD);
// connectionURL = `${connectionURL}/${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`;

mongoose
  .connect(connectionURL, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log('Database connected');
    app.listen(4000, async () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch((e) => {
    console.log('Database connection failed');
    console.log('Message: ', e.message);
  });
