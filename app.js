const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const config = require("./utils/config");

// MySQL DB Connection
const pool = mysql
  .createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.database,
  })
  .promise();

pool
  .getConnection()
  .then((connection) => {
    logger.info(`Connected to MySQL as id ${connection.threadId}`);
    connection.release();
  })
  .catch((err) => {
    logger.error(`Error connecting to MySQL: ${err.stack}`);
  });

// Middleware Connections
app.use(cors());
app.use(express.json());

// Routes
app.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results, fields] = await connection.execute(
      "SELECT 1 + 1 AS solution"
    );
    connection.release(); // Release the connection after use

    res.send(`The solution is: ${results[0].solution}`);
  } catch (error) {
    console.error("Error executing query: " + error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
