const articleService = require('../../../../lib/article');

const findAll = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const sortType = req.query.sort_type || 'dsc';
  const sortBy = req.query.sort_by || 'updatedAt';
  const search = req.query.search || '';

  try {
    //result
    const articles = await articleService.findAll({
      page,
      limit,
      search,
      sortBy,
      sortType,
    });

    const totalArticles = await articleService.count({ search });

    //response generation
    const data = articles.map((article) => ({
      ...article,
      link: `/articles/${article.id}`,
    }));

    res.status(200).json({
      data,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = findAll;
