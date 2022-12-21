const Spot = require("../models/spot");
const {cloudinary}= require('../cloudinary')
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({accessToken: mapBoxToken})

module.exports.index = async (req, res) => {
  const spots = await Spot.find({});
  res.render("./spots/index", { spots });
};

module.exports.newSpot = (req, res) => {
  res.render("./spots/new");
};

module.exports.createSpot = async (req, res, next) => {
  const geodata = await geocoder.forwardGeocode({
    query: req.body.spot.location,
    limit: 1,
    countries: ['pa']
  }).send()
  console.log(geodata.body.features[0].geometry.coordinates)
  const spot = new Spot(req.body.spot);
  spot.images = req.files.map((el) => ({
    url: el.path,
    filename: el.filename,
  }));
  spot.author = req.user._id;
  await spot.save();
  req.flash("success", "Successfully made spot!");
  res.redirect(`/spots/${spot._id}`);
};

module.exports.showSpot = async (req, res) => {
  const spot = await Spot.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!spot) {
    req.flash("error", "Spot not found!");
    return res.redirect("/spots");
  }
  res.render("./spots/show", { spot });
};

module.exports.editSpot = async (req, res) => {
  const spot = await Spot.findByIdAndUpdate(req.params.id, req.body.spot);
  const img = req.files.map((el) => ({
    url: el.path,
    filename: el.filename,
  }));
  spot.images.push(...img);
  if (req.body.deleteImages) {
    for(let filename of req.body.deleteImages ){
      await cloudinary.uploader.destroy(filename)
    }
    await spot.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages } } }});
  }
  await spot.save();
  req.flash("success", "Successfully updated spot!");
  res.redirect(`/spots/${req.params.id}`);
};

module.exports.deleteSpot = async (req, res) => {
  await Spot.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted spot!");
  res.redirect("/spots");
};

module.exports.editForm = async (req, res) => {
  const spot = await Spot.findById(req.params.id);
  if (!spot) {
    req.flash("error", "Spot not found!");
    return res.redirect("/spots");
  }
  res.render("./spots/edit", { spot });
};
