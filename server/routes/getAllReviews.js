const express = require("express");
const router = express.Router();
const Reviews = require("../models/Reviews");

router.get("/", async (req, res) => {
  try {
    const reviews = await Reviews.find().sort({ createdAt: -1 }).limit(30);

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      error:
        "Įvyko klaida gaunant atsiliepimus, kitų vartotojų atsiliepimai nėra rodomi",
    });
  }
});

module.exports = router;
