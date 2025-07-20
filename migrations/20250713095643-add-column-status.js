"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "status", {
      type: Sequelize.STRING,
      defaultValue: "pending",
      values: Sequelize.ENUM("pending", "processing", "completed"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "status");
    await Sequelize.query("DROP TYPE IF EXISTS enum");
  },
};
