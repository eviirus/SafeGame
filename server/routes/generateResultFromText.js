const express = require("express");
const router = express.Router();
const { generateResultFromText } = require("../utils/generateResultFromText");

router.post("/", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await generateResultFromText(text);

    if (response.success === false) {
      return res.status(500).json({
        success: false,
        message: response.error,
      });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
