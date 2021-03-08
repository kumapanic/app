var express = require('express');
var router = express.Router();
var { authenticate, authorize } = require("../lib/security/acountcontrol.js");

router.get("/", authorize("readWrite"), (req, res) => {
  res.render("./account/index.ejs");
  console.log(req.user);
});

router.post("/login", authenticate());

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/account/login");
});

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

module.exports = router;
