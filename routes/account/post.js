var express = require('express');
var router = express.Router();
var tokens = require("csrf")();
var multer = require("multer");
var db = require("../../models/index.js");
var { validationResult } = require('express-validator');
var postRegistValidator = require("../../lib/validate/postRegistValidator.js");
var { authorize } = require("../../lib/security/acountcontrol.js");

var formatImagename = async (image) => {
  var sampleDate = (date, format) => {
    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, date.getMonth() + 1);
    format = format.replace(/DD/, date.getDate());
    return format;
  };
  var date = new Date();
  var formatDate = await sampleDate(date, 'YYYY/MM/DD');
  var imageName = image + formatDate;

  return imageName;
};

var createRegistData = (body, image) => {
  var imagename = formatImagename(file.originalname)
  return {
    url: body.url,
    title: body.title,
    image: imagename,
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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/${process.env.NODE_ENV}/image`)
  },
  filename: function (req, file, cb) {
    var filename = formatImagename(file.originalname);
    cb(null, filename)
  }
});

var upload = multer({ storage: storage })

router.get("/", authorize("readWrite"), (req, res) => {
  tokens.secret((error, secret) => {  //secretを生成
    var token = tokens.create(secret); //引数にsecretを渡して対になるtokenを生成する
    req.session._csrf = secret; //secretを保存
    res.cookie("_csrf", token); //cookieにtokenを保存
    res.render("./account/posts/index.ejs");
  });
});

router.post("/execute", authorize("readWrite"), postRegistValidator(), upload.single('file'), (req, res) => {
  var secret = req.session._csrf; //保存したsecretを取り出す
  var token = req.cookies._csrf; //保存したtokenを取り出す
  if (tokens.verify(secret, token) === false) { //secretとtokenがあっているか検証
    res.redirect("/account/article-posting/error");
    throw new Error("Invalid Token.");
  }

  var original = createRegistData(req.body, req.files.file.name);
  var errors = validationResult(req);

  //バリデート時にエラーがあった場合の処理
  if (!errors.isEmpty()) {
    var message = {};
    errors.errors.forEach(error => {
      message[`${error.param}`] = error.msg;
    });
    res.render("./account/posts/index.ejs", { message, original });
    return;
  }

  //mysql内に保存する処理
  db.posts.create(original)
    .then(result => {
      delete req.session._csrf; //サーバーからtokenを削除
      res.clearCookie("._csrf"); //coolieからtokenを削除
      console.log("--sucsess--");
      res.redirect("/account/article-posting/complete");
    }).catch((error) => {
      console.log(error);
      res.redirect("/account/article-posting/error");
      throw error;
    });
});

//完了画面
router.get("/complete", authorize("readWrite"), (req, res) => { //getで受け取って画面を表示
  res.render("./account/posts/complete.ejs");
});

router.get("/error", authorize("readWrite"), (req, res) => {
  res.render("./account/posts/error.ejs");
});

module.exports = router;