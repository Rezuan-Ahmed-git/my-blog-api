require('dotenv').config();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');
const OpenApiValidator = require('express-openapi-validator');

const databaseConnection = require('./db');
const articleService = require('./services/article.js');

//express app
const app = express();
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(
  OpenApiValidator.middleware({
    apiSpec: './swagger.yaml',
  })
);

app.get('/health', (_req, res) => {
  res.status(200).json({
    health: 'OK',
  });
});

app.get('/api/v1/articles', async (req, res) => {
  // 1. extract query params
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const sortType = req.query.sort_type || 'dsc';
  const sortBy = req.query.sort_by || 'updatedAt';
  const searchTerm = req.query.searchTerm || '';

  // 2. call article service to fetch all articles
  let { totalItems, totalPage, hasNext, hasPrev, articles } =
    await articleService.findArticles({
      page,
      limit,
      sortBy,
      sortType,
      searchTerm,
    });

  // 3. generate necessary responses
  const response = {
    data: articleService.transformArticles({ articles }),
    pagination: {
      page,
      limit,
      totalPage,
      totalItems,
    },
    links: {
      self: req.url,
    },
  };

  if (hasPrev) {
    response.pagination.prev = page - 1;
    response.links.prev = `${req.url}?page=${page - 1}&limit=${limit}`;
  }

  if (hasNext) {
    response.pagination.next = page + 1;
    response.links.next = `${req.url}?page=${page + 1}&limit=${limit}`;
  }

  res.status(200).json(response);
});

app.post('/api/v1/articles', async (req, res) => {
  //step-1: destructure the request body
  const { title, body, cover, status } = req.body;

  //step-2: invoke the service function
  const article = await articleService.createArticle({
    title,
    body,
    cover,
    status,
  });

  //step-3: generate response
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

app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

(async () => {
  await databaseConnection.connect();
  console.log('Database Connected');

  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
})();
