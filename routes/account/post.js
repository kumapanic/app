var express = require('express');
var router = express.Router();
var tokens = require("csrf")();
var multer = require("multer");
var { validationResult, body } = require('express-validator');
var postRegistValidator = require("../../lib/validate/postRegistValidator.js");
var { authenticate, authorize } = require("../../lib/security/acountcontrol.js");

var createRegistData = (body, image) => {
  return {
    url: body.url,
    title: body.title,
    image: image,
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
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage })

router.get("/", (req, res) => {
  res.render("./account/posts/index.ejs");
});

router.post("/execute", postRegistValidator(), upload.single('file'), (req, res) => {
  // var secret = req.session._csrf; //保存したsecretを取り出す
  // var token = req.cookies._csrf; //保存したtokenを取り出す
  // if (tokens.verify(secret, token) === false) { //secretとtokenがあっているか検証
  //   res.redirect("/contact/error");
  //   throw new Error("Invalid Token.");
  // }

  // var original = createRegistData(req.body, req.files.file.name);
  var errors = validationResult(req);

  res.send(req.);

  // //バリデート時にエラーがあった場合の処理
  // if (!errors.isEmpty()) {
  //   var message = {};
  //   errors.errors.forEach(error => {
  //     message[`${error.param}`] = error.msg;
  //   });
  //   res.render("./account/posts/index.ejs", { message, original });
  //   return;
  // }

  // //mysql内に保存する処理
  // db.posts.create(original)
  //   .then(result => {
  //     // delete req.session._csrf; //サーバーからtokenを削除
  //     // res.clearCookie("._csrf"); //coolieからtokenを削除
  //     res.redirect("/account/article-posting/complete");
  //   }).catch((error) => {
  //     console.log(error);
  //     res.redirect("/account/article-posting/error");
  //     throw error;
  //   });
});

//完了画面
router.get("/complete", (req, res) => { //getで受け取って画面を表示
  res.render("./account/posts/complete.ejs");
});

router.get("/error", (req, res) => {
  res.render("./account/posts/error.ejs");
});

module.exports = router;