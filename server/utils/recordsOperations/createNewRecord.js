const Record = require("../../models/Records");

async function createNewRecord(text, result) {
  try {
    if (!result || !text) {
      console.log("Missing fields");
      return;
    }

    const cleanedResult = result.map((item) => ({
      metaname: item.metaname,
      answer: item.answer === "true",
    }));

    const newRecord = new Record({
      text,
      result: cleanedResult,
    });

    await newRecord.save();
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createNewRecord };
