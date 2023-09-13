const service = require('../../../../lib/article');

const updateItemPatch = async (req, res, next) => {
  try {
    const article = await service.updateArticleV2(req.params.id, req.body);
    res.status(200).json(article);
  } catch (e) {
    next(e);
  }
};

module.exports = updateItemPatch;
