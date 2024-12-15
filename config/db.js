// var mysql = require("mysql");
const { Client } = require("pg");
const con = new Client({
  host: process.env.HOST,
  user: process.env.USER_ID,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  // below can be cancelled if I am on mysql
  ssl: true,
});
// const dbOptions = {
//   host: process.env.HOST,
//   user: process.env.USER_ID,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DATABASE,
//   port: process.env.PORT,
// };

// const con = mysql.createConnection(dbOptions);
con
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

module.exports = con;
