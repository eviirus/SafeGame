const express = require("express");
const router = express.Router();

const { generateResultFromText } = require("../utils/generateResultFromText");
const { formatOutput } = require("../utils/formatOutput");

const { isDuplicate } = require("../utils/recordsOperations/isDuplicate");
const { createNewRecord } = require("../utils/recordsOperations/createNewRecord");
const { shouldBeUpdated } = require("../utils/recordsOperations/shouldBeUpdated");
const { updateRecord } = require("../utils/recordsOperations/updateRecord");
const { getResultFromRecords } = require("../utils/recordsOperations/getResultFromRecords");

async function generateResponse(text) {
  return generateResultFromText(text); // error handling done upstream
}

async function saveNewRecord(text, response, questions) {
  await createNewRecord(text, response);
  console.log("GENERATED NEW RESULT");
  return formatOutput(questions, response);
}

async function updateExistingRecord(recordId, text, response, questions) {
  await updateRecord(recordId, text, response);
  console.log("GENERATED NEW RESULT AND UPDATED OLD RECORD");
  return formatOutput(questions, response);
}

async function handleStoredRecord(recordId, text, questions) {
  const stored = await getResultFromRecords(recordId);

  if (stored.success === false) {
    const newResponse = await generateResponse(text);
    console.log("FAILED TO LOAD RESULT FROM DB, GENERATED NEW RESULT");
    return formatOutput(questions, newResponse);
  }

  console.log("RETRIEVED RESULT FROM DB");
  return formatOutput(questions, stored);
}

async function fetchOrGenerateResult(text, questions) {
  const recordId = await isDuplicate(text);

  if (!recordId) {
    const response = await generateResponse(text);
    return saveNewRecord(text, response, questions);
  }

  if (await shouldBeUpdated(recordId)) {
    const response = await generateResponse(text);
    return updateExistingRecord(recordId, text, response, questions);
  }

  return handleStoredRecord(recordId, text, questions);
}


router.post("/", async (req, res) => {
  const { text, questions } = req.body;

  try {
    const result = await fetchOrGenerateResult(text, questions);

    if (result?.success === false) {
      return res.status(500).json({
        success: false,
        message: result.error,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("ROUTE ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

