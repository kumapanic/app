var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var config = require("../../config/config.json");
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
var express = require('express');
var db = require("../../models/index.js");
var original = require("../../lib/format/formatDate.js");
var { authorize } = require("../../lib/security/acountcontrol.js");

var max_item_per_page = 10;

var onePage = (req, res) => {
  db.posts.findAndCountAll({
    order: [
      ["createdAt", "desc"]
    ],
    limit: max_item_per_page
  }).then((result) => {
    var lastpage = (result.count > 0) ? Math.ceil(result.count / max_item_per_page) : 1;
    var list = original(result.rows);
    var data = {
      count: result.count,
      list: list,
      pagenation: {
        max: lastpage - 1,
        current: 1
      }
    };
    res.render("./account/list/index.ejs", data);
  }).catch((error) => {
    console.log(error);
    res.render("./account/list/err.ejs");
    throw error;
  });
};

var pagenation = (req, res) => {
  var page = req.params.page ? parseInt(req.params.page) : 1;
  var numif = isNaN(page);
  db.posts.findAndCountAll({
    order: [
      ["createdAt", "desc"]
    ],
    offset: page * max_item_per_page,
    limit: max_item_per_page
  }).then((result) => {
    var lastpage = (result.count > 0) ? Math.ceil(result.count / max_item_per_page) : 1;
    var list = original(result.rows);
    var data = {
      count: result.count,
      list: list,
      pagenation: {
        max: lastpage - 1,
        current: page
      }
    }
    //存在しないページをユーザーから指定されたときの処理
    if (numif == true || lastpage < page) {
      res.render("./account/list/err.ejs");
    } else {
      res.render("./account/list/index.ejs", data);
    }
  }).catch((error) => {
    console.log(error);
    res.render("./account/list/err.ejs");
    throw error;
  });
};

//1ページ処理
router.get("/", authorize("readWrite"), (req, res) => {
  onePage(req, res);
});

//2ページ以降のページング処理
router.get('/page=:page', authorize("readWrite"), (req, res) => {
  if (req.params.page == 1) {
    onePage(req, res);
  } else if (req.params.page == 0) {
    res.render("./account/list/err.ejs");
  } else {
    pagenation(req, res);
  }
});

module.exports = router;
