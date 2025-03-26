const express = require("express");
const router = express.Router();
const {
  generateResultFromText,
} = require("../utils/generateResultFromText.js");

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const response = await generateResultFromText(text);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
