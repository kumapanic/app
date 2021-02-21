'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      subtitle1: {
        type: Sequelize.STRING
      },
      subtitle2: {
        type: Sequelize.STRING
      },
      subtitle3: {
        type: Sequelize.STRING
      },
      subtitle4: {
        type: Sequelize.STRING
      },
      subtitle5: {
        type: Sequelize.STRING
      },
      subcontent: {
        type: Sequelize.STRING
      },
      content1: {
        type: Sequelize.STRING(1000)
      },
      content2: {
        type: Sequelize.STRING(1000)
      },
      content3: {
        type: Sequelize.STRING(1000)
      },
      content4: {
        type: Sequelize.STRING(1000)
      },
      content5: {
        type: Sequelize.STRING(1000)
      },
      content6: {
        type: Sequelize.STRING(1000)
      },
      authors: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  }
};