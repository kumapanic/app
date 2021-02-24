const e = require("express");

var sampleDate = (date, format) => {
  format = format.replace(/YYYY/, date.getFullYear());
  format = format.replace(/MM/, date.getMonth() + 1);
  format = format.replace(/DD/, date.getDate());

  return format;
};

var list = (result) => {
  var listData = [];
  result.forEach(element => {
    var date = new Date(element.updatedAt);
    var formatDate = sampleDate(date, 'YYYY年MM月DD日');
    var obj = {
      title: element.title,
      url: element.url,
      image: element.image,
      subtitle1: element.subtitle1,
      subtitle2: element.subtitle2,
      subtitle3: element.subtitle3,
      subtitle4: element.subtitle4,
      subtitle5: element.subtitle5,
      content1: element.content1,
      content2: element.content2,
      content3: element.content3,
      content4: element.content4,
      content5: element.content5,
      subcontent: element.subcontent,
      date: formatDate
    }
    listData.push(obj);
  });

  return listData;
};

module.exports = list;