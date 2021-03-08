var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var db = require("../models/index.js");
var archive = require("../lib/archive/archive.js");

var onepage = (req, res, keyword, page, numif) => {
  db.posts.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${keyword}%`
      }
    },
    order: [
      ["createdAt", "desc"]
    ],
    limit: 5
  }).then(result => {
    console.log(result);
    var lastpage = (result.count > 0) ? Math.ceil(result.count / 5) : 1;
    var data = {
      keyword,
      count: result.count,
      list: result.rows,
      pagenation: {
        max: lastpage,
        current: page
      },
      archiveDate: archive
    }
    if (numif == true || lastpage < page || data.list == "") {
      res.render("./error/err.ejs", { archiveDate: archive });
    } else {
      res.render("./search/index.ejs", data);
    }
  }).catch((error) => {
    console.log(error);
    res.render("./error/err.ejs", { archiveDate: archive });
    throw error;
  });
};

var paging = (req, res, keyword, page, numif) => {
  db.posts.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${keyword}%`
      }
    },
    order: [
      ["createdAt", "desc"]
    ],
    limit: 5,
    offset: page * 5
  }).then(result => {
    var lastpage = (result.count > 0) ? Math.ceil(result.count / 5) : 1;
    var data = {
      keyword,
      count: result.count,
      list: result.rows,
      pagenation: {
        max: lastpage - 1,
        current: page
      },
      archiveDate: archive
    }
    if (numif == true || lastpage < page || data.list == "") {
      res.render("./error/err.ejs", { archiveDate: archive });
    } else {
      res.render("./search/index.ejs", data);
    }
  }).catch((error) => {
    console.log(error);
    res.render("./error/err.ejs", { archiveDate: archive });
    throw error;
  });
}


router.get("/*", (req, res) => {
  var keyword = req.query.keyword || "";
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var numif = isNaN(page);
  console.log(keyword);
  console.log(page);

  if (keyword == "" || keyword == "_") {
    res.render("./error/err.ejs", { archiveDate: archive });
  } else if (page == 1) {
    onepage(req, res, keyword, page, numif);
  } else {
    paging(req, res, keyword, page, numif);
  }
});


module.exports = router;
