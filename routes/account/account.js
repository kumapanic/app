var express = require('express');
var router = express.Router();
var tokens = require("csrf")();
var { authenticate, authorize, csrfCountermeasures } = require("../../lib/security/acountcontrol.js");

router.get("/", authorize("readWrite"), (req, res) => {
  res.render("./account/index.ejs");
});

router.post("/login", csrfCountermeasures(), authenticate());

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/account/login");
});

router.get("/login", (req, res) => {
  tokens.secret((error, secret) => {  //secretを生成
    var token = tokens.create(secret); //引数にsecretを渡して対になるtokenを生成する
    req.session._csrf = secret; //secretを保存
    res.cookie("_csrf", token); //cookieにtokenを保存
    res.render("./account/login.ejs", { message: req.flash("message") });
  });
});

module.exports = router;
