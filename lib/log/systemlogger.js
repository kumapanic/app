var logger = require("./logger.js").system;
module.exports = function (options) { //ミドルウェアを実行した際にリターンする
  return function (err, req, res, next) {
    logger.error(err.message);
    next(err);
  };
}; 