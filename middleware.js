const ExpressError = require("./utils/ExpressError");
const { spotSchema, reviewSchema } = require("./validationSchemas");
const Spot = require("./models/spot");

module.exports.isLoggedIn=(req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.backTo = req.originalUrl;
        req.flash('error', 'You must be singed in first!')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateSpot = (req, res, next) =>{
    const result = spotSchema.validate(req.body);
    const { error } = result;
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  }
  
 module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    console.log(spot);
    if (!spot.author.equals(req.user._id)) {
      req.flash("error", "You not allowed to do that!");
      return res.redirect(`/spots/${id}`);
    }
    next();
  };

module.exports.validateReview = (req, res, next)=> {
    const result = reviewSchema.validate(req.body);
    const { error } = result;
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  } 