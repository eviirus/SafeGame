const express = require("express");
const router = express.Router();
const { convertFile } = require("../utils/fileConverter.js");
const {
  generateResultFromText,
} = require("../utils/generateResultFromText.js");

const MIN_INPUT_LENGTH = 1000;

router.post("/", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.file;

  try {
    const result = await convertFile(file);

    if (result.data.length < MIN_INPUT_LENGTH) {
      return res.status(400).json({
        success: false,
        message:
          "Patikrinkite ar failą sudaro pilnas privatumo politikos tekstas",
      });
    }

    if (result.success) {
      const response = await generateResultFromText(result);

      res.json(result);
      res.json(response);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
