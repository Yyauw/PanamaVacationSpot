const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controller/reviewController");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewController.newReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewController.deleteReview
);

module.exports = router;
