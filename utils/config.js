require("dotenv").config();

let dbhost, dbuser, dbpassword, database;

if (process.env.NODE_ENV === "development") {
  dbhost = process.env.DB_HOST;
  dbuser = process.env.DB_USER;
  dbpassword = process.env.DB_PASSWORD;
  database = process.env.DB_DATABASE;
} else if (process.env.NODE_ENV === "test") {
  dbhost = process.env.TEST_DB_HOST;
  dbuser = process.env.TEST_DB_USER;
  dbpassword = process.env.TEST_DB_PASSWORD;
  database = process.env.TEST_DB_DATABASE;
} else {
  dbhost = process.env.PROD_DB_HOST;
  dbuser = process.env.PROD_DB_USER;
  dbpassword = process.env.PROD_DB_PASSWORD;
  database = process.env.PROD_DB_DATABASE;
}

const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

module.exports = {
  dbhost,
  dbuser,
  dbpassword,
  database,
  adminName,
  adminEmail,
  adminPassword,
  PORT,
  SECRET,
};
