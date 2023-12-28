require("dotenv").config();

const dbhost = process.env.DB_HOST;
const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
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
