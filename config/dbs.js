const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE
    : process.env.DATABASE,
  process.env.NODE_ENV === "test"
    ? process.env.TEST_USER_ID
    : process.env.USER_ID,
  process.env.DB_PASSWORD,
  {
    host:
      process.env.NODE_ENV === "test"
        ? process.env.TEST_HOST
        : process.env.HOST,
    port: process.env.SERVER_PORT,
    dialect: "postgres",
    logging: console.log,
  }
);
const testSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testSequelize();
module.exports = sequelize;
