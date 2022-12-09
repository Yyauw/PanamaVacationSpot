const express = require("express");
app = express();
const path = require("path");
const mongoose = require("mongoose");
const Spot = require("./models/spot");
const Review = require("./models/review");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { spotSchema, reviewSchema } = require("./validationSchemas");
const Spots = require('./routes/spots')

mongoose
  .connect("mongodb://localhost:27017/PanamaVacationSpot")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ exteded: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.use('/spots', Spots);

app.get("/", async (req, res) => {
  res.render("home");
});

app.post(
  "/spots/:id/review",
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

app.delete("/spots/:id/review/:reviewId", async(req,res)=>{
  const {id, reviewId} = req.params
  await Spot.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/spots/${id}`)
})

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Somenthing Went Wrong";
  res.status(statusCode).render("./partials/error", { err });
});

app.listen("3000", () => {
  console.log("listening on port 3000");
});
