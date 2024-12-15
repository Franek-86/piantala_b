const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_ID,
  process.env.DB_PASSWORD,

  {
    host: process.env.HOST,
    port: process.env.PORT,
    // dialect: "mysql",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Force SSL
        rejectUnauthorized: false, // Allow self-signed certificates (use with caution)
      },
    },
    logging: console.log, // Optional: Log SQL queries for debugging
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
