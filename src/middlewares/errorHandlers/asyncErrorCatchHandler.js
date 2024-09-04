// Catch the async functions errors and call the global error handler by using next()
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      next(error);
    });
  };
};
