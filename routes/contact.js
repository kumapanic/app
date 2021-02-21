var express = require("express");
var router = express.Router();
var ItemRegistValidator = require("../lib/validate/ItemRegistValidator.js");
var { validationResult } = require('express-validator');
var db = require("../models/index.js");

//値を保存(元の画面に戻すため又はmyqlに値を保存するための成型)
var createRegistData = (body) => {
  var day = new Date();
  var dateTime = `${day.getFullYear()}/${day.getMonth()}/${day.getDate()}`;

  return {
    name: body.name,
    email: body.email,
    title: body.title,
    content: body.content,
    createdAt: dateTime,
  };
};

//お問い合わせページ
router.get("/", (req, res) => {
  res.render("./contact/index.ejs");
});

//戻るボタンの遷移先
router.post("/input", (req, res) => {
  var original = createRegistData(req.body);  //データの復元仕組み
  res.render("./contact/index.ejs", { original });
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
    res.render("./contact/index.ejs", { message, original });
    return;
  }

  res.render("./contact/confirm.ejs", { original });
});

//確認画面からの遷移先
router.post("/execute", ItemRegistValidator(), (req, res) => {
  var original = createRegistData(req.body);//一時的に値を保存
  var errors = validationResult(req);

  //バリデート時にエラーがあった場合の処理
  if (!errors.isEmpty()) {
    var message = {}
    errors.errors.forEach(error => {
      message[`${error.param}`] = error.msg;
    });
    res.render("./contact/index.ejs", { message, original });
    return;
  }
  //mysql内に保存する処理
  db.contact.create(original)
    .then(result => {
      res.redirect("/contact/complete");
    }).catch((error) => {
      console.log(error);
      res.render("./error/err.ejs");
      throw error;
    });
  //メール送る処理(今後実装)

});

//完了画面
router.get("/complete", (req, res) => { //getで受け取って画面を表示
  res.render("./contact/complete.ejs");
});


module.exports = router;