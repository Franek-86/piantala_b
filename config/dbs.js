const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_ID,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "mysql",
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
