const express = require("express");
const Spot = require("../models/spot");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateSpot } = require("../middleware");
const spotController = require("../controller/spotsController");

router.get("/", spotController.index);

router.post(
  "/",
  isLoggedIn,
  validateSpot,
  catchAsync(spotController.createSpot)
);

router.get("/new", isLoggedIn, spotController.newSpot);

router.get("/:id", catchAsync(spotController.showSpot));

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateSpot,
  catchAsync(spotController.editSpot)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(spotController.deleteSpot)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(spotController.editForm)
);

module.exports = router;
