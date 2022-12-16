const Spot = require("../models/spot");

module.exports.index = async (req, res) => {
  const spots = await Spot.find({});
  res.render("./spots/index", { spots });
};

module.exports.newSpot = (req, res) => {
  res.render("./spots/new");
};

module.exports.createSpot = async (req, res, next) => {
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
  await Spot.findByIdAndUpdate(req.params.id, req.body.spot);
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
