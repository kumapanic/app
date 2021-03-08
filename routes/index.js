var express = require('express');
var router = express.Router();
var db = require("../models/index.js");
var original = require("../lib/format/formatDate.js");
var archive = require("../lib/archive/archive.js");

/* GET home page. */
router.get('/', function (req, res, next) {
  db.posts.findAll({
    order: [
      ["createdAt", "desc"]
    ],
    limit: 10
  }).then((result) => {
    var list = original(result);
    res.render("./index.ejs", { list: list, archiveDate: archive });
  }).catch((error) => {
    console.log(error);
    throw error;
  });
});

module.exports = router;
