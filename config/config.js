require("dotenv").config();
module.exports = {
  development: {
    username: process.env.USER_ID,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "postgres",
  },
  test: {
    username: process.env.TEST_USER_ID,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DATABASE,
    host: process.env.TEST_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.USER_ID,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: "postgres",
  },
};
