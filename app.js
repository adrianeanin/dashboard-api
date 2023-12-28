const express = require("express");
require("express-async-errors");
require("dotenv").config();
const app = express();
const cors = require("cors");
const sequelize = require("./utils/database");
const User = require("./models/user");
const Link = require("./models/link");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const linkRouter = require("./routes/linkRouter");
const middleware = require("./utils/middleware");

// DB Connection
User.hasMany(Link, { foreignKey: "userId", as: "links" }); // Associations

sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    console.log("Sync successful");
    console.log("The result", res);
  })
  .catch((err) => {
    console.error("Sync failed");
    console.error("An error", err);
  });

// Middleware Connections
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// Routes
app.use("/api/users", registerRouter, loginRouter);
app.use("/api/links", linkRouter);

// Error handling middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
