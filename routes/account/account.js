var express = require('express');
var router = express.Router();
var tokens = require("csrf")();
var { validationResult, body } = require('express-validator');
var postRegistValidator = require("../../lib/validate/postRegistValidator.js");
var { authenticate, authorize, csrfCountermeasures } = require("../../lib/security/acountcontrol.js");

var app = express();

var createRegistData = body => {
  return {
    url: body.url,
    title: body.title,
    image: body.image,
    subtitle1: body.subtitle1,
    subtitle2: body.subtitle2,
    subtitle3: body.subtitle3,
    subtitle4: body.subtitle4,
    subtitle5: body.subtitle5,
    subcontent: body.overview,
    content1: body.content,
    content2: body.subcontent1,
    content3: body.subcontent2,
    content4: body.subcontent3,
    content5: body.subcontent4,
    content6: body.subcontent5
  };
};

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
