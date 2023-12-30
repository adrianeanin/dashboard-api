const express = require("express");
require("express-async-errors");
require("dotenv").config();
const app = express();
const cors = require("cors");
const compression = require("compression");
const RateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sequelize = require("./utils/database");
const logger = require("./utils/logger");
const User = require("./models/user");
const Link = require("./models/link");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const linkRouter = require("./routes/linkRouter");
const middleware = require("./utils/middleware");

// DB Connection
User.hasMany(Link, { foreignKey: "userId", as: "links" }); // Association
const environment = process.env.NODE_ENV || "development";

if (environment === "test") {
  sequelize.sync({ force: true });
} else {
  sequelize.sync().catch((err) => {
    logger.error("Sync failed", err);
  });
}

// Middleware Connections
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(limiter);
app.disable("x-powered-by"); // Extra layer of security to reduce server fingerprinting

// Routes
app.use("/api/users", registerRouter, loginRouter);
app.use("/api/links", linkRouter);

// Error handling middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
