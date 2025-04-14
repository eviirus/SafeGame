const express = require("express");
const router = express.Router();
const { convertFile } = require("../utils/fileConverter.js");
const { returnTextInputValue } = require("../utils/formatTextInput.js");

router.post("/", async (req, res) => {
  const file = req.files.file;

  try {
    const result = await convertFile(file);
    const finalResult = await returnTextInputValue(result.data);

    if (!finalResult.success) {
      return res.status(400).json({
        success: false,
        message: finalResult.message,
        reason: finalResult.errorMessage,
      });
    }

    return res.status(200).json({
      success: true,
      formattedText: finalResult.formattedText,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
