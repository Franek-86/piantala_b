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
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    gender: {
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
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      // defaultValue: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    verification_token: {
      type: Sequelize.STRING,
    },
    updated_at: {
      type: Sequelize.TIME,
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW,
    },
  },
  { underscored: true },
  { updatedAt: false }
);

module.exports = User;
