var hash = require("./hash.js");
var db = require("../../models/index.js");
const config = require("../../config/config.json");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var Sequelize = require("sequelize");
const sequelize = new Sequelize(config[process.env.NODE_ENV]);
var Op = Sequelize.Op;
var initialize, authenticate, authorize;

//クライアント側にデータを返す
passport.serializeUser((name, done) => {
  done(null, name); //そのまま加工せずに渡す
});

passport.deserializeUser((name, done) => {
  db.users.findOne({
    where: {
      email: name
    }
  }).then(user => {
    return new Promise((resolve, reject) => {
      sequelize.query(`select * from privileges where role = '${user.role}';`)
        .then(privilege => {
          user.permissions = privilege[0][0].permissions;
          resolve(user);
        }).catch(error => {
          reject(error);
        });
    });
  }).then(user => {
    done(null, user);
  }).catch(error => {
    done(error);
  });
});

passport.use("local-strategy",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true //trueにしておかないと第二引数にリクエストが渡されない
  }, (req, username, password, done) => {
    db.users.findOne({
      where: {
        [Op.and]: {
          email: username,
          password: password //ハッシュ化したパスワードを探すhash.digest(password)
        }
      }
    }).then(user => {
      //問題がないかの判定処理
      if (user) {
        req.session.regenerate((error) => { //ログインしたらセッションを変更する処理
          if (error) {
            done(error);
          } else {
            done(null, user.email); //問題がなければuserにemailを渡す
          }
        });
      } else {
        //問題があればdoneにfalseを渡してエラーメッセージを出力する
        done(null, false, req.flash("message", "ユーザー名 または パスワードが間違っています。"));
      }
    }).catch(error => {
      done(error);
    })
  })
);

initialize = function () { //app.useに渡したいmodule
  return [
    passport.initialize(),
    passport.session(),
    function (req, res, next) {
      //ユーザー情報があればログイン情報をejsに引き渡す
      if (req.user) {
        res.locals.user = req.user;
      }
      next();
    }
  ];
};

authenticate = function () {
  return passport.authenticate( //ログイン画面に渡す
    "local-strategy", {
    successRedirect: "/account", //成功したとき
    failureRedirect: "/account/login" //失敗したとき
  }
  );
};

authorize = function (privilege) {
  return function (req, res, next) {
    //認証されていて且つ権限があればnext、そうでなければリダイレクト
    if (req.isAuthenticated() &&
      (req.user.permissions || []).indexOf(privilege) >= 0) {
      next();
    } else {
      res.redirect("/account/login");
    }
  };
};

module.exports = {
  initialize,
  authenticate,
  authorize
};