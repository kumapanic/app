var createRegistData = (body) => {
  return {
    url: body.url,
    title: body.title,
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

var validateRegistData = () => {
  return (req, res, next) => {

    var body = req.body;
    var original = createRegistData(req.body);
    var isValidated = true, errors = {}; //フラグの名称はisXxx,hasXxx,canXxxとつけるとtrue/falseの意味が明示的になる

    //bodyのurlが入力されているかをチェック
    if (!body.url) {
      isValidated = false;
      errors.url = "URL欄が未入力です。'/'から始まるURLを入力してください。";
    }
    //bodyのurlが入力されているがバックスラッシュから始まっていないことをチェック
    if (body.url && /^\//.test(body.url) === false) {
      isValidated = false;
      errors.url = "'/'から始まるURLを入力してください。";
    }
    //タイトルが入力されているかをチェック
    if (!body.title) {
      isValidated = false;
      errors.title = "タイトル欄が未入力です。任意のタイトルを入力してください。";
    }
    //概要が入力されているかチェック
    if (!body.overview) {
      isValidated = false;
      errors.overview = "概要欄が未入力です。概要を入力してください。";
    }
    //コンテンツが入力されているかチェック
    if (!body.content) {
      isValidated = false;
      errors.content = "コンテンツが未入力です。コンテンツ欄をを入力してください。";
    }
    //ファイルが入力されているかチェック
    if (!req.file) {
      isValidated = false;
      errors.file = "ファイルが選択されていません。ファイルを選択してください。";
    }
    //ファイルが特定の拡張子ではない場合
    if (req.fileValidationError) {
      isValidated = false;
      errors.file = req.fileValidationError;
    }
    //検証したデータが問題なければundefined,問題があればerrorを返してあげる
    if (!isValidated) {
      res.render("./account/posts/index.ejs", { message: errors, original });
    } else {
      next()
    }
  }
}

module.exports = validateRegistData;
