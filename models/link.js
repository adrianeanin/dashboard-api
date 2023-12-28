const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Link = sequelize.define("Link", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: { type: DataTypes.STRING, allowNull: false },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Link;
