const Sequelize = require('sequelize');
const config = require("../config/config.json");
const sequelize = new Sequelize(config[process.env.NODE_ENV]);
var express = require('express');
var router = express.Router();
var db = require("../models/index.js");
const date = require('../lib/archive/archive');

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

//archiveの件数取得
var archiveCount = function (url) {
  var count;
  sequelize.query(`select count(*) from posts where date_format(createdAt,'%Y%m')=${url}`).then(result => {
    count = result;
  });
  return count;
};
//archiveの1ページの処理
var archiveOnePage = function (req, res) {
  sequelize.query(`select * from posts where date_format(createdAt,'%Y%m')=${req.params.url} order by createAt desc limit 5`)
    .then(result => {
      var lastpage = (result.count > 0) ? Math.ceil(result.count / 5) : 1;
      var count = archiveCount(req.params.url);
      var data = {
        count: count,
        list: result,
        pagenation: {
          max: lastpage,
          current: 1
        }
      };
      res.render("./article/archive/index.js", data);
    }).catch((error) => {
      console.log(error);
      res.render("./error/err.ejs");
      throw error;
    });
};

var archivePagenation = function (req, res) {
  var page = req.params.page ? parseInt(req.params.page) : 1;
  var numif = isNaN(page);
  sequelize.query(`select * from posts where date_format(createdAt,'%Y%m')=${req.params.url} order by createAt desc limit 5, ${page * 5}`)
    .then((result) => {
      var count = archiveCount(req.params.url);
      var lastpage = (count > 0) ? Math.ceil(count / 5) : 1;
      var data = {
        count: count,
        list: result,
        pagenation: {
          max: lastpage,
          current: page
        }
      };
      if (numif == true || lastpage < page) {
        res.render("./error/err.ejs");
      } else {
        res.render("./article/archive/index.js", data);
      }
    }).catch((error) => {
      console.log(error);
      res.render("./error/err.ejs");
      throw error;
    });
};

//1ページアーカイブ
router.get("/archive/date=:url", (req, res) => {
  archiveOnePage(req, res);
});

//2ページ以降のアーカイブ
router.get("/archive/date=:url/page=:page", (req, res) => {
  if (req.params.page == 1) {
    archiveOnePage(req, res);
  } else {
    archivePagenation(req, res);
  }
});

module.exports = router;
