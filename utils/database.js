const Sequelize = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.database,
  config.dbuser,
  config.dbpassword,
  { dialect: "mysql", host: config.dbhost }
);

module.exports = sequelize;
