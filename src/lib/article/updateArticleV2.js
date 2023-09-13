const Article = require('../../model/Article');
const { notFound, badRequest } = require('../../utils/error');

//These paths are not permitted
const restrictedPaths = ['id', '_id', 'author', 'createdAt', 'updatedAt'];

const updateArticleV2 = async (id, operations = []) => {
  const article = await Article.findById(id);
  if (!article) {
    throw notFound();
  }

  for (let operation of operations) {
    const { op, path, value } = operation;
    if (restrictedPaths.includes(path)) {
      throw badRequest(`Path (${path}) is not permitted`);
    }

    switch (op) {
      case 'replace':
        article[path] = value;
        break;
      case 'add':
        article.set(path, value);
        break;
      //   case 'remove':
      //     delete article[path];
      //     break;

      default:
        throw badRequest(`Invalid Operation ${op}`);
    }
  }

  await article.save();
  return article._doc;
};

module.exports = updateArticleV2;
