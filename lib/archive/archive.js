const Sequelize = require('sequelize');
const config = require("../../config/config.json");
const sequelize = new Sequelize(config[process.env.NODE_ENV]);
var date = [];
sequelize.query('select date_format(createdAt,"%Y-%m") as date, count(*) as count from posts  group by date_format(createdAt,"%Y%m") order by createdAt desc;')
  .then(result => {
    result[0].forEach(element => {
      var spritDate = String(element.date).split("-");
      var resultDate = spritDate[0] + "年" + spritDate[1] + "月";
      var resultUrl = spritDate[0] + spritDate[1];
      var obj = {
        date: resultDate,
        count: element.count,
        url: resultUrl
      }
      date.push(obj);
    });
  });

module.exports = date;