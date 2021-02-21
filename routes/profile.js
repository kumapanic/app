var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("./profile/index.ejs");
});

module.exports = router;