var { PASSWORD_SALT, PASSWORD_STRETCH } = require("../../config/app.config.js").security;
var crypto = require("crypto");

var digest = function (text) {
  var hash;

  text += PASSWORD_SALT;

  for (var i = PASSWORD_STRETCH; i--;) {
    hash = crypto.createHash("sha256"); //ハッシュ化
    hash.update(text); //ハッシュ化したい文字列を与える
    text = hash.digest("hex"); //ハッシュ化したものを取得
  }

  return text; //ハッシュ化したものを返す
};

module.exports = {
  digest
};  