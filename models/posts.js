'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  posts.init({
    url: DataTypes.STRING,
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    subtitle1: DataTypes.STRING,
    subtitle2: DataTypes.STRING,
    subtitle3: DataTypes.STRING,
    subtitle4: DataTypes.STRING,
    subtitle5: DataTypes.STRING,
    subcontent: DataTypes.STRING,
    content1: DataTypes.STRING(1000),
    content2: DataTypes.STRING(1000),
    content3: DataTypes.STRING(1000),
    content4: DataTypes.STRING(1000),
    content5: DataTypes.STRING(1000),
    content6: DataTypes.STRING(1000),
    authors: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};