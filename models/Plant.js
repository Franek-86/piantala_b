const Sequelize = require("sequelize");
const sequelize = require("../config/dbs");

const Plant = sequelize.define(
  "plant",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lat: {
      type: Sequelize.NUMBER,
      allowNull: false,
      unique: false,
    },
    lang: {
      type: Sequelize.NUMBER,
      allowNull: false,
      unique: false,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    created_at: {
      type: Sequelize.TIME,
      defaultValue: Sequelize.DataTypes.NOW,
      allowNull: false,
      unique: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    },
    status_piantina: {
      type: Sequelize.STRING,
      defaultValue: "pending",
      allowNull: false,
    },
    rejection_comment: {
      type: Sequelize.STRING,
      // allowNull: false,
      unique: true,
    },
    user_comment: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    plant_type: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    owner_id: {
      type: Sequelize.INTEGER,
      // allowNull: false,
    },
    purchase_date: {
      type: Sequelize.DATE,
      // allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW,
    },
    delete_hash: {
      type: Sequelize.STRING,
    },
    road: {
      type: Sequelize.STRING,
      defaultValue: 0,
    },
    residential: {
      type: Sequelize.STRING,
    },
    suburb: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    shop: {
      type: Sequelize.DataTypes.STRING,
      // allowNull: false,
    },
    house_number: {
      type: Sequelize.DataTypes.STRING,
      // allowNull: false,
    },
    plate: {
      type: Sequelize.DataTypes.STRING,
      // allowNull: false,
    },
    plate_hash: {
      type: Sequelize.DataTypes.STRING,
      // allowNull: false,
    },
  },
  // { underscored: true },
  {
    timestamps: false,
  }
);

module.exports = Plant;
