const mongoose = require("mongoose");
const Spot = require("../models/spot");
const cities = require("./cities");
const { places } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/PanamaVacationSpot")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function createSpot() {
  await Spot.deleteMany({});
  for (let x = 0; x < 50; x++) {
    const random100 = Math.floor(Math.random() * 563);
    const randomplaces = Math.floor(Math.random() * places.length);
    const spot = new Spot({
      location: `${cities[random100].city}, ${cities[random100].admin_name}`,
      title: `${cities[random100].city} ${places[randomplaces]}`,
    });
    await spot.save();
  }
}

createSpot().then(() => {
  mongoose.connection.close();
});
