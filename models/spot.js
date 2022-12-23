const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const opt = {toJSON:{virtuals:true}}

const SpotSchema = new Schema({
  title: String,
  images: [{
    url:String,
    filename:String
  }],
  price: Number,
  description: String,
  location:String,
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required: true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
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
},opt);

SpotSchema.virtual('properties.popUpMarkup').get( function(){
return `<a href="/spots/${this._id}">${this.title}</a><p class="text-muted">${this.location}</p>`;
})

SpotSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Spot", SpotSchema);
