const Spot = require("../models/spot");
const Review = require("../models/review");

module.exports.newReview = async (req, res) => {
  const spot = await Spot.findById(req.params.id);
  const rev = await new Review(req.body.review);
  rev.author = req.user._id;
  spot.reviews.push(rev);
  await spot.save();
  await rev.save();
  req.flash("success", "Successfully made review!");
  res.redirect(`/spots/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/spots/${id}`);
};
