require("dotenv").config();

const PORT = process.env.PORT;
const dbhost = process.env.DB_HOST;
const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

module.exports = {
  PORT,
  dbhost,
  dbuser,
  dbpassword,
  database,
};
