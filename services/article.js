const Article = require('../models/Article');
const databaseConnection = require('../db');

const findArticles = async ({
  page = 1,
  limit = 5,
  sortType = 'dsc',
  sortBy = 'updatedAt',
  searchTerm = '',
}) => {
  const articleInstance = new Article(databaseConnection.db.articles);
  let articles;

  //filter based on Search Term
  if (searchTerm) {
    articles = await articleInstance.search(searchTerm);
  } else {
    articles = await articleInstance.find();
  }

  //sorting
  articles = await articleInstance.sort(articles, sortType, sortBy);

  //pagination
  const { result, totalItems, totalPage, hasNext, hasPrev } =
    await articleInstance.pagination(articles, page, limit);

  return {
    totalItems,
    totalPage,
    hasNext,
    hasPrev,
    articles: result,
  };
};

const transformArticles = ({ articles = [] }) => {
  return articles.map((article) => {
    const transformed = { ...article };
    transformed.author = {
      id: transformed.authorId,
      // TODO: find author name - authorService
    };
    transformed.link = `/articles/${transformed.id}`;
    delete transformed.body;
    delete transformed.authorId;

    return transformed;
  });
};

module.exports = { findArticles, transformArticles };
