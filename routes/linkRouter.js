const express = require("express");
const router = express.Router();
const {
  createLink,
  getAllLinks,
  getLinkById,
  updateLink,
  deleteLink,
} = require("../controllers/linkController");
const middleware = require("../utils/middleware");

router.get("/", getAllLinks);

router.get("/:id", getLinkById);

router.post(
  "/create-link",
  middleware.tokenExtractor,
  middleware.userExtractor,
  middleware.authenticateJWT,
  createLink
);

router.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  middleware.authenticateJWT,
  updateLink
);

router.delete(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  middleware.authenticateJWT,
  deleteLink
);

module.exports = router;
