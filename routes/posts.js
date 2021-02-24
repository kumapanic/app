var express = require('express');
var router = express.Router();
var db = require("../models/index.js");
var original = require("../lib/format/formatDate.js");

router.get("/*", (req, res) => {
  db.posts.findAll({
    where: {
      url: req.url
    }
  }).then((result) => {
    if (result == "") {
      res.render("./error/err.ejs");
    } else {
      var list = original(result);
      res.render("./posts/index.ejs", { list });
    }
  }).catch((error) => {
    console.log(error);
    res.render("./error/err.ejs");
    throw error;
  });
});


module.exports = router;
