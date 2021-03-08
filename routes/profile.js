var express = require("express");
var router = express.Router();
var archive = require("../lib/archive/archive.js");


router.get("/", (req, res) => {
  res.render("./profile/index.ejs", { archiveDate: archive });
});

module.exports = router;