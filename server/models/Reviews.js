const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  starRating: { type: Number, required: true },
  review: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema, "reviews");
