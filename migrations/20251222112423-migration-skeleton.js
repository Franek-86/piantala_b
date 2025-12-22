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
    queryInterface.addColumn("users", "google", {
      type: Sequelize.DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn("users", "google", {
      type: Sequelize.DataTypes.SMALLINT,
      defaultValue: 1,
      allowNull: false,
    });
  },
};
