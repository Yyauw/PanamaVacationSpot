const express = require("express");
app = express();
const path = require('path')
const mongoose = require('mongoose')
const Spot = require("./models/spot")

mongoose
  .connect("mongodb://localhost:27017/PanamaVacationSpot")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });


app.set("view engine", 'ejs')
app.set('views', path.join(__dirname,'views'))

app.get("/", async(req, res) => {
  const spot = new Spot({title:'Chica', description:'vista preciosa y es totalmente gratis'})
  await spot.save()
  console.log(spot)
  res.render('home')
});

app.listen("3000", () => {
  console.log("listening on port 3000");
});
