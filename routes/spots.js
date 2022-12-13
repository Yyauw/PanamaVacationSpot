const express = require("express");
const Spot = require("../models/spot");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isAuthor, validateSpot} = require("../middleware");

router.get("/", async (req, res) => {
  const spots = await Spot.find({});
  res.render("./spots/index", { spots });
});

router.post(
  "/",
  isLoggedIn,
  validateSpot,
  catchAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    spot.author = req.user._id;
    await spot.save();
    req.flash("success", "Successfully made spot!");
    res.redirect(`/spots/${spot._id}`);
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("./spots/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    if (!spot) {
      req.flash("error", "Spot not found!");
      return res.redirect("/spots");
    }
    res.render("./spots/show", { spot });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateSpot,
  catchAsync(async (req, res) => {
    await Spot.findByIdAndUpdate(req.params.id, req.body.spot);
    req.flash("success", "Successfully updated spot!");
    res.redirect(`/spots/${req.params.id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    await Spot.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted spot!");
    res.redirect("/spots");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      req.flash("error", "Spot not found!");
      return res.redirect("/spots");
    }
    res.render("./spots/edit", { spot });
  })
);

module.exports = router;
