const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { controllers: articleController } = require('../api/v1/article');
const { controllers: articleControllerV2 } = require('../api/v2/article');
const { controllers: authController } = require('../api/v1/auth');

// Auth routes
router
  .post('/api/v1/auth/register', authController.register)
  .post('/api/v1/auth/login', authController.login);

// Article routes
router
  .route('/api/v1/articles')
  .get(articleController.findAllItems)
  .post(authenticate, articleController.create);

router
  .route('/api/v1/articles/:id')
  .get(articleController.findSingleItem)
  .put(authenticate, articleController.updateItem)
  .patch(authenticate, articleController.updateItemPatch)
  .delete(authenticate, articleController.removeItem);

router
  .route('/api/v2/articles/:id')
  .patch(authenticate, articleControllerV2.updateItemPatch);

module.exports = router;
