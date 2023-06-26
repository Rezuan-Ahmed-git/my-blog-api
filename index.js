require('dotenv').config();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

require('./db.js');

//express app
const app = express();
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.get('/health', (_req, res) => {
  res.status(200).json({
    health: 'OK',
  });
});

app.get('/api/v1/articles', (req, res) => {
  // 1. extract query params
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const sortType = req.query.sort_type || 'asc';
  const sortBy = req.query.sort_by || 'updatedAt';
  const searchTerm = req.query.search || '';
  console.log('Query params', req.query);
  console.log('Default params', { page, limit, sortBy, sortType, searchTerm });
  // 2. call article service to fetch all articles
  // 3. generate necessary responses

  res.status(200).json({ path: '/articles', method: 'get' });
});

app.post('/api/v1/articles', (req, res) => {
  res.status(200).json({ path: '/articles', method: 'post' });
});

app.get('/api/v1/articles/:id', (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: 'get' });
});

app.put('/api/v1/articles/:id', (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: 'put' });
});

app.patch('/api/v1/articles/:id', (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: 'patch' });
});

app.delete('/api/v1/articles/:id', (req, res) => {
  res
    .status(200)
    .json({ path: `/articles/${req.params.id}`, method: 'delete' });
});

app.post('/api/v1/auth/signup', (req, res) => {
  res.status(200).json({ path: '/auth/signup', method: 'post' });
});

app.post('/api/v1/auth/signin', (req, res) => {
  res.status(200).json({ path: '/auth/signin', method: 'post' });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
