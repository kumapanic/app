var express = require("express");
var router = express.Router();
var tokens = require("csrf")();
var ItemRegistValidator = require("../lib/validate/ItemRegistValidator.js");
var { validationResult, body } = require('express-validator');
var db = require("../models/index.js");
var archive = require("../lib/archive/archive.js");

//値を保存(元の画面に戻すため又はmyqlに値を保存するための成型)
var createRegistData = body => {
  return {
    name: body.name,
    email: body.email,
    title: body.title,
    content: body.content
  };
};

//お問い合わせページ
router.get("/", (req, res) => {
  tokens.secret((error, secret) => {  //secretを生成
    var token = tokens.create(secret); //引数にsecretを渡して対になるtokenを生成する
    req.session._csrf = secret; //secretを保存
    res.cookie("_csrf", token); //cookieにtokenを保存
    res.render("./contact/index.ejs", { archiveDate: archive });
  });
});

//戻るボタンの遷移先
router.post("/input", (req, res) => {
  var original = createRegistData(req.body);  //データの復元仕組み
  res.render("./contact/index.ejs", { original, archiveDate: archive });
});

//お問い合わせページからpostで値を受け取る//確認画面
router.post("/confirm", ItemRegistValidator(), (req, res) => {
  var original = createRegistData(req.body);//一時的に値を保存
  var errors = validationResult(req);

  //バリデート時にエラーがあった場合の処理
  if (!errors.isEmpty()) {
    var message = {}
    errors.errors.forEach(error => {
      message[`${error.param}`] = error.msg;
    });
    res.render("./contact/index.ejs", { message, original, archiveDate: archive });
    return;
  }
  res.render("./contact/confirm.ejs", { original, archiveDate: archive });
});

//確認画面からの遷移先
router.post("/execute", ItemRegistValidator(), (req, res) => {
  var secret = req.session._csrf; //保存したsecretを取り出す
  var token = req.cookies._csrf; //保存したtokenを取り出す
  if (tokens.verify(secret, token) === false) { //secretとtokenがあっているか検証
    res.redirect("/contact/error");
    throw new Error("Invalid Token.");
  }
  var original = createRegistData(req.body);//一時的に値を保存
  var errors = validationResult(req);

  //バリデート時にエラーがあった場合の処理
  if (!errors.isEmpty()) {
    var message = {}
    errors.errors.forEach(error => {
      message[`${error.param}`] = error.msg;
    });
    res.render("./contact/index.ejs", { message, original, archiveDate: archive });
    return;
  }
  //mysql内に保存する処理
  db.contact.create(original)
    .then(result => {
      delete req.session._csrf; //サーバーからtokenを削除
      res.clearCookie("._csrf"); //coolieからtokenを削除
      res.redirect("/contact/complete");
    }).catch((error) => {
      console.log(error);
      res.redirect("/contact/error");
      throw error;
    });
  //メール送る処理(今後実装)

});

//完了画面
router.get("/complete", (req, res) => { //getで受け取って画面を表示
  res.render("./contact/complete.ejs", { archiveDate: archive });
});

router.get("/error", (req, res) => {
  res.render("./contact/error.ejs", { archiveDate: archive });
});

module.exports = router;