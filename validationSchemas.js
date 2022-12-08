const Joi = require("joi");

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
    }).required(),
  });

  module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      body:Joi.string().allow(""),
      rating:Joi.number().required().min(1).max(5)
    }).required()
  })