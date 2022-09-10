const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.sendStatus(401);
};

const isAuthorized = (req, res, next) => {};

module.exports = {
  isAuthenticated,
  isAuthorized,
};
