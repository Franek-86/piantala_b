"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("users", "city", {
      // birthday: {
      //   type: Sequelize.DATE,
      //   allowNull: true,
      //   unique: false,
      // },

      type: Sequelize.STRING,
      allowNull: true,
      unique: false,

      // gender: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      //   unique: true,
      // },
      // email: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   unique: true,
      // },
      // user_password: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // phone: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
    });
    await queryInterface.changeColumn("users", "birthday", {
      type: Sequelize.DATE,
      allowNull: true,
      unique: false,
    });
    await queryInterface.changeColumn("users", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("users", "city", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
    await queryInterface.changeColumn("users", "birthday", {
      type: Sequelize.DATE,
      allowNull: true,
      unique: false,
    });
    await queryInterface.changeColumn("users", "phone", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
