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
    queryInterface.addColumn("users", "terms", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    });
    queryInterface.addColumn("users", "terms_date", {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.DataTypes.NOW,
      allowNull: true,
    });
    queryInterface.addColumn("users", "terms_v", {
      type: Sequelize.DataTypes.INTEGER,
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
    queryInterface.removeColumn("users", "terms", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    });
    queryInterface.removeColumn("users", "terms_date", {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.DataTypes.NOW,
      allowNull: true,
    });
    queryInterface.removeColumn("users", "terms_v", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    });
  },
};
