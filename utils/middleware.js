const logger = require("./logger");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "");
    req.token = token;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;

  if (token) {
    const decodedToken = jwt.verify(token, config.SECRET);

    if (decodedToken.id) {
      const user = await User.findByPk(decodedToken.id);
      req.user = user;
    }
  }

  next();
};

const authenticateJWT = (req, res, next) => {
  const token = req.token;

  const decodedToken = jwt.verify(token, config.SECRET);
  if (!decodedToken || !decodedToken.id) {
    return res.status(401).json({ error: "Token invalid" });
  }

  next();
};

// For Development only
const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ err: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ err: err.message });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      err: "invalid token",
    });
  } else if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      err: "token expired",
    });
  } else if (err.name === "SequelizeValidationError") {
    return res
      .status(400)
      .json({ err: "Validation error", details: err.errors });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ err: "Email already exists" });
  }

  next(err);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  authenticateJWT,
};
