const express = require("express");
const router = express.Router();
const { generateResultFromText } = require("../utils/generateResultFromText");
const { formatOutput } = require("../utils/formatOutput");
const { isDuplicate } = require("../utils/recordsOperations/isDuplicate");
const {
  createNewRecord,
} = require("../utils/recordsOperations/createNewRecord");
const {
  shouldBeUpdated,
} = require("../utils/recordsOperations/shouldBeUpdated");
const { updateRecord } = require("../utils/recordsOperations/updateRecord");
const {
  getResultFromRecords,
} = require("../utils/recordsOperations/getResultFromRecords");

router.post("/", async (req, res) => {
  const { text, questions } = req.body;

  try {
    const recordId = await isDuplicate(text);
    let result = "";

    if (!recordId) {
      const response = await generateResponse(text);

      await createNewRecord(text, response);
      result = await formatOutput(questions, response);
      console.log("GENERATED NEW RESULT");
    } else if (await shouldBeUpdated(recordId)) {
      const response = await generateResponse(text);

      await updateRecord(recordId, text, response);
      result = await formatOutput(questions, response);
      console.log("GENERATED NEW RESULT AND UPDATED OLD RECORD");
    } else {
      const response = await getResultFromRecords(recordId);

      if (response.success === false) {
        const newResponse = await generateResponse(text);
        result = await formatOutput(questions, newResponse);
        console.log("FAILED TO LOAD RESULT FROM DB, GENERATED NEW RESULT");
      }

      console.log("RETRIEVED RESULT FROM DB");
      result = await formatOutput(questions, response);
    }

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

async function generateResponse(text) {
  const response = await generateResultFromText(text);

  if (response.success === false) {
    return response;
  }

  return response;
}

module.exports = router;
