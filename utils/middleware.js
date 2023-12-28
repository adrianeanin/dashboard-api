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
      const user = await User.findbyPk(decodedToken.id);
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

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  authenticateJWT,
};
