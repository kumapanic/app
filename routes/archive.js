const Sequelize = require('sequelize');
const config = require("../../config/config.json");
const sequelize = new Sequelize(config[process.env.NODE_ENV]);

var archive = (req, date) => {
  
};

module.exports = archive;