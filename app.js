const express = require("express");
app = express();
const path = require("path");
const mongoose = require("mongoose");
const Spot = require("./models/spot");

mongoose
  .connect("mongodb://localhost:27017/PanamaVacationSpot")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/spots", async (req, res) => {
  const spots = await Spot.find({});
  res.render("./spots/index", {spots});
});

app.get("/spots/:id", async (req, res) => {
  const spot = await Spot.findById(req.params.id);
  res.render("./spots/show", {spot});
});

app.listen("3000", () => {
  console.log("listening on port 3000");
});
