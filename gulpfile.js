var config = require("./gulp/config.js");
var { series, parallel } = require("gulp");
var load = require("require-dir");
var tasks, development, production;

tasks = load("./gulp/tasks", { recurse: true });

development = series(
  tasks["clean-log"],
  tasks["copy-images"],
  tasks["copy-javascripts"],
  tasks["copy-third_party"],
  tasks["compile-sass"],
  tasks["minify-javascripts"]
);

production = series(
  tasks["clean-log"],
  tasks["copy-images"],
  tasks["copy-javascripts"],
  tasks["copy-third_party"],
  tasks["compile-sass"],
  tasks["minify-javascripts"]
);

module.exports = {
  "clean-log": series(tasks["clean-log"]),
  "copy-images": series(tasks["copy-images"]),
  "copy-javascripts": series(tasks["copy-javascripts"]),
  "copy-third_party": series(tasks["copy-third_party"]),
  "compile-sass": series(tasks["compile-sass"]),
  "minify-javascripts": series(tasks["minify-javascripts"]),
  development,
  production,
  default: config.env.IS_DEVELOPMENT ? development : production
};