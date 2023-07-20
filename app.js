require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');
const OpenApiValidator = require('express-openapi-validator');

//express app
const app = express();
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(
  OpenApiValidator.middleware({
    apiSpec: './swagger.yaml',
  })
);

app.use((req, res, next) => {
  req.user = {
    id: 999,
    name: 'Rezuan',
  };
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    health: 'OK',
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
connectionURL = `${connectionURL}/${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`;

mongoose
  .connect(connectionURL, {
    serverSelectionTimeoutMS: 500,
  })
  .then(() => {
    console.log('Database connected');
    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });
  })
  .catch((e) => {
    console.log('Database connection failed');
    console.log('Message: ', e.message);
  });
