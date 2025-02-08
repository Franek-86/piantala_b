// var mysql = require("mysql");
const { Client } = require("pg");
require("dotenv").config();

const config = {
  production: {
    host: process.env.HOST,
    user: process.env.USER_ID,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.SERVER_PORT,
    pool_mode: "transaction",
  },
  test: {
    host: process.env.TEST_HOST,
    user: process.env.TEST_USER_ID,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DATABASE,
    port: process.env.SERVER_PORT,
  },
};
let liveConfig =
  process.env.NODE_ENV === "test" ? config.test : config.production;

const con = new Client(liveConfig);
con
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

module.exports = con;
