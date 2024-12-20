// var mysql = require("mysql");
const { Client } = require("pg");
const con = new Client({
  host: process.env.HOST,
  user: process.env.USER_ID,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
});
con
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

module.exports = con;
