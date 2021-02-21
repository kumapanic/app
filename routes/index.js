var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

/* GET home page. */
router.get('/', function (req, res, next) {
  db.posts.findAll({
    order: [
      ["createdAt", "desc"]
    ],
    limit: 10
  }).then((result) => {
    res.render("./index.ejs", { list: result });
  }).catch((error) => {
    console.log(error);
    throw error;
  });
});

module.exports = router;
