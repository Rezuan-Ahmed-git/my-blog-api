const authenticate = (req, _res, next) => {
  req.user = {
    id: 999,
    name: 'Rezuan',
  };
  next();
};

module.exports = authenticate;
