const express = require("express");
const Spot = require("../models/spot");
const router = express.Router()
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { spotSchema} = require("../validationSchemas");

function validateSpot(req, res, next) {
    const result = spotSchema.validate(req.body);
    const { error } = result;
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  }
  

router.get("/", async (req, res) => {
    const spots = await Spot.find({});
    res.render("./spots/index", { spots });
  });
  
  router.post(
    "/",
    validateSpot,
    catchAsync(async (req, res, next) => {
      const spot = new Spot(req.body.spot);
      await spot.save();
      res.redirect("/spots");
    })
  );
  
  router.get("/new", (req, res) => {
    res.render("./spots/new");
  });
  
  router.get(
    "/:id",
    catchAsync(async (req, res) => {
      const spot = await Spot.findById(req.params.id).populate('reviews');
      res.render("./spots/show", { spot });
    })
  );
  
  router.put(
    "/:id",
    validateSpot,
    catchAsync(async (req, res) => {
      await Spot.findByIdAndUpdate(req.params.id, req.body.spot);
      res.redirect(`/spots/${req.params.id}`);
    })
  );
  
  router.delete(
    "/:id",
    catchAsync(async (req, res) => {
      await Spot.findByIdAndDelete(req.params.id);
      res.redirect("/spots");
    })
  );
  
  router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
      const spot = await Spot.findById(req.params.id);
      res.render("./spots/edit", { spot });
    })
  );

  module.exports = router;