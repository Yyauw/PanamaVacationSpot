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
    const priceGenerator = Math.floor(10 + Math.random() * 50);
    const spot = new Spot({
      author: "639625e34ebc12897aad1daf",
      location: `${cities[random100].city}, ${cities[random100].admin_name}`,
      title: `${cities[random100].city} ${places[randomplaces]}`,
      geometry: {
        type: "Point",
        coordinates: [cities[random100].lng, cities[random100].lat],
      },
      images: [
        {
          url: "https://source.unsplash.com/collection/11649432/1600x900",
          filename: "jijija",
        },
        {
          url: "https://source.unsplash.com/collection/9457892/1600x900",
          filename: "jijija2",
        },
      ],
      price: priceGenerator,
      time: new Date().getDate(),
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit quas doloremque saepe, ullam, itaque, necessitatibus explicabo modi ratione inventore qui ducimus sapiente minima iste odit commodi! Magnam quasi inventore ratione",
    });
    await spot.save();
  }
}

createSpot().then(() => {
  mongoose.connection.close();
});
