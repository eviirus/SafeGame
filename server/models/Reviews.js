const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    starRating: { type: Number, required: true },
    name: { type: String },
    review: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema, "reviews");
