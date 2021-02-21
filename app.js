var accesslogger = require("./lib/log/accesslogger.js");
var systemlogger = require("./lib/log/systemlogger.js");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

console.log("モード：" + process.env.NODE_ENV);

var app = express();

// view engine setup
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.disable("x-powerd-by");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//配信するファイルを指定している
app.use("/public", express.static(__dirname + "/public/" + (process.env.NODE_ENV === "development" ? "development" : "production")));

//アクセスログ
app.use(accesslogger());

app.use("/", (() => {
  var router = express.Router();

  router.use((req, res, next) => { //画面にカスタムヘッダーを追加
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    next();
  });
  router.use("/posts/", require("./routes/posts.js"));
  router.use("/article/", require("./routes/article.js"));
  router.use("/search/", require("./routes/search.js"));
  router.use("/profile/", require("./routes/profile.js"));
  router.use("/contact/", require("./routes/contact.js"));
  router.use("/", require("./routes/index.js"));

  return router;
})());

//システムログ
app.use(systemlogger());

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
