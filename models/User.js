const Sequelize = require("sequelize");
const sequelize = require("../config/dbs");
const { useId } = require("react");

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "user_id",
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    user_password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    verification_token: {
      type: Sequelize.STRING,
    },
    updated_at: {
      type: Sequelize.TIME,
    },
  },
  { underscored: true },
  { updatedAt: false }
);

module.exports = User;
