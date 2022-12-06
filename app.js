const express = require("express");
app = express();
const path = require("path");
const mongoose = require("mongoose");
const Spot = require("./models/spot");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const {spotSchema} = require("./validationSchemas")

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

app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/spots", async (req, res) => {
  const spots = await Spot.find({});
  res.render("./spots/index", { spots });
});

app.post(
  "/spots",
  validateSpot,
  catchAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    await spot.save();
    res.redirect("/spots");
  })
);

app.get("/spots/new", (req, res) => {
  res.render("./spots/new");
});

app.get(
  "/spots/:id",
  catchAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render("./spots/show", { spot });
  })
);

app.put(
  "/spots/:id",
  validateSpot,
  catchAsync(async (req, res) => {
    await Spot.findByIdAndUpdate(req.params.id, req.body.spot);
    res.redirect(`/spots/${req.params.id}`);
  })
);

app.delete(
  "/spots/:id",
  catchAsync(async (req, res) => {
    await Spot.findByIdAndDelete(req.params.id);
    res.redirect("/spots");
  })
);

app.get(
  "/spots/:id/edit",
  catchAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render("./spots/edit", { spot });
  })
);

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
