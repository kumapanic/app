var accesslogger = require("./lib/log/accesslogger.js");
var systemlogger = require("./lib/log/systemlogger.js");
var { SESSION_SECRET } = require("./config/app.config.js").security;
var archive = require("./lib/archive/archive.js");
var accountcontrol = require("./lib/security/acountcontrol.js");
var express = require('express');
var path = require('path');
var loger = require("morgan");
var cookieParser = require('cookie-parser');
var session = require("express-session");
var flash = require("connect-flash");

var app = express();

console.log("モード：" + process.env.NODE_ENV);

// view engine setup
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.disable("x-powerd-by");
//配信するファイルを指定している
app.use("/public", express.static(__dirname + "/public/" + (process.env.NODE_ENV === "development" ? "development" : "production")));

//アクセスログ
app.use(accesslogger());
app.use(loger('dev'));

app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sid"
}));
app.use(express.urlencoded({ extended: true }));// サーバー側の処理
app.use(express.json());
app.use(flash());
app.use(...accountcontrol.initialize());//...分割代入

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
  router.use("/account/", require("./routes/account/account.js"));
  router.use("/account/article-posting", require("./routes/account/post.js"));
  router.use("/account/article-list", require("./routes/account/list.js"));
  router.use("/", require("./routes/index.js"));

  return router;
})());

//システムログ
app.use(systemlogger());

app.use((req, res, next) => { //404のページを出力する
  var data = {
    method: req.method,
    protocol: req.protocol,
    version: req.httpVersion,
    url: req.url
  };
  res.status(404);
  if (req.xhr) { //ajaxのリクエストがされたかどうか
    res.json(data);
  } else {
    res.render("./404.ejs", { archiveDate: archive });
  }
});

app.use((err, req, res, next) => { //500のページ
  var data = {
    method: req.method,
    protocol: req.protocol,
    version: req.httpVersion,
    url: req.url,
    error: (process.env.NODE_ENV === "development") ? {
      name: err.name,
      message: err.message,
      stack: err.stack
    } : undefined
  };
  res.status(500);
  if (req.xhr) {
    res.json(data);
  } else {
    console.log(err);
    res.render("./500.ejs");
  }
});

module.exports = app;
