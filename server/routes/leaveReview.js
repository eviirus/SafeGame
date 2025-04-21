const express = require("express");
const router = express.Router();
const Review = require("../models/Reviews");

router.post("/", async (req, res) => {
  const { starRating, name, review } = req.body;

  try {
    if (!starRating) {
      return res.status(400).json({ error: "Missing star rating" });
    }

    const newReview = new Review({
      starRating: starRating,
      name: name,
      review: review,
    });

    await newReview.save();

    res
      .status(201)
      .json({ success: true, message: "Review saved successfully" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
