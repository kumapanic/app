var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var config = require("../../config/config.json");
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
var express = require('express');
var db = require("../../models/index.js");
var { authorize } = require("../../lib/security/acountcontrol.js");

router.get("/", authorize("readWrite"), (req, res) => {

  res.render("./account/list/index.ejs");
});

var onePage = function (req, res) {
  db.posts.findAndCountAll({
    order: [
      ["createdAt", "desc"]
    ],
    limit: 5
  }).then((result) => {
    var lastpage = (result.count > 0) ? Math.ceil(result.count / 5) : 1;
    var list = original(result.rows);
    var data = {
      count: result.count,
      list: list,
      pagenation: {
        max: lastpage,
        current: 1
      },
      archiveDate: archive
    };
    res.render("./article/index.ejs", data);
  }).catch((error) => {
    console.log(error);
    throw error;
  });
};

var pagenation = function (req, res) {
  var page = req.params.page ? parseInt(req.params.page) : 1;
  var numif = isNaN(page);
  db.posts.findAndCountAll({
    order: [
      ["createdAt", "desc"]
    ],
    offset: page * 5,
    limit: 5
  }).then((result) => {
    var lastpage = (result.count > 0) ? Math.ceil(result.count / 5) : 1;
    var list = original(result.rows);
    var data = {
      count: result.count,
      list: list,
      pagenation: {
        max: lastpage,
        current: page
      },
      archiveDate: archive
    }
    //存在しないページをユーザーから指定されたときの処理
    if (numif == true || lastpage < page) {
      res.render("./error/err.ejs", { archiveDate: archive });
    } else {
      res.render("./article/index.ejs", data);
    }
  }).catch((error) => {
    console.log(error);
    res.render("./error/err.ejs", { archiveDate: archive });
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
  } else if (req.params.page == 0) {
    res.render("./error/err.ejs", { archiveDate: archive });
  } else {
    pagenation(req, res);
  }
});

//archiveの1ページの処理
var archiveOnePage = (req, res) => {
  sequelize.query(`select * from posts where date_format(createdAt,'%Y%m')=${req.params.url} order by createdAt desc limit 5`)
    .then(result => {
      sequelize.query(`select count(*) as count from posts where date_format(createdAt,'%Y%m')=${req.params.url}`).then(num => {
        var lastpage = (num[0][0].count > 0) ? Math.ceil(num[0][0].count / 5) : 1;
        var list = original(result[0]);
        var data = {
          count: num[0][0].count,
          list: list,
          pagenation: {
            max: lastpage,
            current: 1
          },
          archiveDate: archive
        };
        res.render("./article/archive/index.ejs", data);
      }).catch((error) => {
        console.log(error);
        res.render("./error/err.ejs", { archiveDate: archive });
        throw error;
      });
    }).catch((error) => {
      console.log(error);
      res.render("./error/err.ejs", { archiveDate: archive });
      throw error;
    });
};

//archiveのページネーション
var archivePagenation = (req, res) => {
  var page = req.params.page ? parseInt(req.params.page) : 1;
  sequelize.query(`select * from posts where date_format(createdAt,'%Y%m')=${req.params.url} order by createdAt desc limit ${page * 5},5`)
    .then((result) => {
      sequelize.query(`select count(*) as count from posts where date_format(createdAt,'%Y%m')=${req.params.url}`).then(num => {
        var numif = isNaN(page);
        var lastpage = (num[0][0].count > 0) ? Math.ceil(num[0][0].count / 5) : 1;
        var list = original(result[0]);
        var data = {
          count: num[0][0].count,
          list: list,
          pagenation: {
            max: lastpage,
            current: page
          },
          archiveDate: archive
        };
        if (numif == true || lastpage < page) {
          res.render("./error/err.ejs", { archiveDate: archive });
        } else {
          res.render("./article/archive/index.ejs", data);
        }
      }).catch((error) => {
        console.log(error);
        res.render("./error/err.ejs", { archiveDate: archive });
        throw error;
      });
    }).catch((error) => {
      console.log(error);
      res.render("./error/err.ejs", { archiveDate: archive });
      throw error;
    });
};

//1ページアーカイブ
router.get("/archive/date=:url", (req, res) => {
  archiveOnePage(req, res);
});

//2ページ以降のアーカイブ
router.get("/archive/url=:url/page=:page", (req, res) => {
  if (req.params.page == 1) {
    archiveOnePage(req, res);
  } else if (req.params.page == 0) {
    res.render("./error/err.ejs", { archiveDate: archive });
  } else {
    archivePagenation(req, res);
  }
});

module.exports = router;
