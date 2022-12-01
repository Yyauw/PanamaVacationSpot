const express = require("express");
app = express();
const path = require("path");
const mongoose = require("mongoose");
const Spot = require("./models/spot");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/PanamaVacationSpot")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({exteded:true}))
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/spots", async (req, res) => {
  const spots = await Spot.find({});
  res.render("./spots/index", {spots});
});

app.post("/spots", async (req, res) => {
  const spot = new Spot(req.body.spot);
  await spot.save();
  res.redirect("/spots")
});


app.get("/spots/new", (req, res) => {
  res.render("./spots/new");
});

app.get("/spots/:id", async (req, res) => {
  const spot = await Spot.findById(req.params.id);
  res.render("./spots/show", {spot});
});

app.put("/spots/:id", async (req, res) => {
  await Spot.findByIdAndUpdate(req.params.id, req.body.spot)
  res.redirect(`/spots/${req.params.id}`)
});

app.delete("/spots/:id", async (req, res) => {
  await Spot.findByIdAndDelete(req.params.id)
  res.redirect("/spots")
});

app.get("/spots/:id/edit", async (req, res) => {
  const spot = await Spot.findById(req.params.id);
  res.render("./spots/edit", {spot});
});

app.listen("3000", () => {
  console.log("listening on port 3000");
});
