var mysql = require("mysql");
const dbOptions = {
  host: "localhost",
  user: process.env.USER_ID,
  password: process.env.DB_PASSWORD,
  database: "ti_pianto_per_amore",
};

const con = mysql.createConnection(dbOptions);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
