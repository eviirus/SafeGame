const express = require("express");
const router = express.Router();
const { generateResultFromText } = require("../utils/generateResultFromText");
const { formatOutput } = require("../utils/formatOutput");

router.post("/", async (req, res) => {
  const { text, questions } = req.body;

  try {
    const response = await generateResultFromText(text);

    if (response.success === false) {
      return res.status(500).json({
        success: false,
        message: response.error,
      });
    }

    const result = await formatOutput(questions, response);

    if (result.success === false) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
