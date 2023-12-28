const express = require("express");
const router = express.Router();
const middleware = require("../utils/middleware");
const { addUser } = require("../controllers/registerController");

router.post(
  "/add",
  middleware.tokenExtractor,
  middleware.userExtractor,
  middleware.authenticateJWT,
  addUser
);

module.exports = router;
