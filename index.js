const express = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

//express app
const app = express();
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.get('/health', (_req, res) => {
  res.status(200).json({
    health: 'OK',
  });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
