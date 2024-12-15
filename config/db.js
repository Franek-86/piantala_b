var mysql = require("mysql");

const dbOptions = {
  host: process.env.HOST,
  user: process.env.USER_ID,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
};

const con = mysql.createConnection(dbOptions);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
