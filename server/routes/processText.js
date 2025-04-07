const express = require("express");
const router = express.Router();
const { formatTextInput } = require("../utils/formatTextInput.js");

router.post("/", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await formatTextInput(text);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
