const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
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
  .post(authenticate, authorize(['admin']), articleController.create);

router
  .route('/api/v1/articles/:id')
  .get(articleController.findSingleItem)
  .put(authenticate, authorize(['user', 'admin']), articleController.updateItem)
  .patch(
    authenticate,
    authorize(['user', 'admin']),
    articleController.updateItemPatch
  )
  .delete(authenticate, authorize(['admin']), articleController.removeItem);

router
  .route('/api/v2/articles/:id')
  .patch(authenticate, articleControllerV2.updateItemPatch);

module.exports = router;
