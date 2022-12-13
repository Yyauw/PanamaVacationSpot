const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const SpotSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author:{
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

SpotSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Spot", SpotSchema);
