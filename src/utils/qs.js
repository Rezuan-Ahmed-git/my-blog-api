const generateQueryString = (query) => {
  return Object.keys(query)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
    })
    .join('&');
};

module.exports = { generateQueryString };
