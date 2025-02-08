const Sequelize = require("sequelize");
const sequelize = require("../config/dbs");
const { useId } = require("react");

// first_name: first_name,
// last_name: last_name,
// address: address,
// birthday: birthday,
// fiscal_code: fiscal_code,

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "user_id",
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    birthday: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: false,
    },
    fiscal_code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
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
    user_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      // defaultValue: false,
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
