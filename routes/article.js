var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

var onePage = function (req, res) {
  db.posts.findAndCountAll({
    order: [
      ["createdAt", "desc"]
    ],
    limit: 5
  }).then((result) => {
    var lastpage = (result.count > 0) ? Math.ceil(result.count / 5) : 1;
    var data = {
      count: result.count,
      list: result.rows,
      pagenation: {
        max: lastpage,
        current: 1
      }
    }
    res.render("./article/index.ejs", data);
  }).catch((error) => {
    console.log(error);
    throw error;
  });
};

var pagenation = function (req, res) {
  var page = req.params.page ? parseInt(req.params.page) : 1;
  var numif = isNaN(page);
  //console.log(req.params);
  db.posts.findAndCountAll({
    order: [
      ["createdAt", "desc"]
    ],
    offset: page * 5,
    limit: 5
  }).then((result) => {
    var lastpage = (result.count > 0) ? Math.ceil(result.count / 5) : 1;
    // console.log(lastpage);
    // console.log(numif);
    //console.log(result.rows);
    var data = {
      count: result.count,
      list: result.rows,
      pagenation: {
        max: lastpage,
        current: page
      }
    }
    //console.log(data);
    //存在しないページをユーザーから指定されたときの処理
    if (numif == true || lastpage < page) {
      res.render("./error/err.ejs");
    } else {
      res.render("./article/index.ejs", data);
    }
  }).catch((error) => {
    console.log(error);
    res.render("./error/err.ejs");
    throw error;
  });
};


//1ページ処理
router.get("/", (req, res) => {
  onePage(req, res);
});


//2ページ以降のページング処理
router.get('/page=:page', (req, res) => {
  if (req.params.page == 1) {
    onePage(req, res);
  } else {
    pagenation(req, res);
  }
});

module.exports = router;
