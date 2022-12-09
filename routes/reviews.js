const express = require("express");
const router = express.Router({mergeParams: true})
const {reviewSchema } = require("../validationSchemas");
const catchAsync = require("../utils/catchAsync");
const Review = require('../models/review')
const Spot = require("../models/spot");

function validateReview(req, res, next) {
    const result = reviewSchema.validate(req.body);
    const { error } = result;
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  }  

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
      const spot = await Spot.findById(req.params.id);
      const rev = await new Review(req.body.review);
      spot.reviews.push(rev);
      await spot.save();
      await rev.save();
      res.redirect(`/spots/${req.params.id}`);
    })
  );
  
  router.delete("/:reviewId", async(req,res)=>{
    const {id, reviewId} = req.params
    await Spot.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/spots/${id}`)
  })

  module.exports = router