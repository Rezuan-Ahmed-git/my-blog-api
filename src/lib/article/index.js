const { Article } = require('../../model');
const defaults = require('../../config/defaults');

const findAll = async ({
  page = defaults.page,
  limit = defaults.limit,
  sortType = defaults.sortType,
  sortBy = defaults.sortBy,
  search = defaults.search,
}) => {
  const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;

  const filter = { title: { $regex: search, $options: 'i' } };

  const articles = await Article.find(filter)
    .populate({ path: 'author', select: 'name' })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return articles.map((article) => ({
    ...article._doc,
    id: article.id,
  }));
};

const count = ({ search = defaults.search }) => {
  const filter = { title: { $regex: search, $options: 'i' } };
  return Article.count(filter);
};

const create = ({ title, body = '', cover = '', status = 'draft', author }) => {
  if (!title || !author) {
    const error = new Error('Invalid parameters');
    error.status = 400;
    throw error;
  }

  const article = new Article({
    title,
    body,
    cover,
    status,
    author: author.id,
  });
  return article.save();
};

module.exports = { findAll, create, count };
