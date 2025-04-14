const express = require("express");
const router = express.Router();
const { returnTextInputValue } = require("../utils/formatTextInput.js");

router.post("/", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await returnTextInputValue(text);

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message,
        reason: response.errorMessage,
      });
    }

    return res.status(200).json({
      success: true,
      formattedText: response.formattedText,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
