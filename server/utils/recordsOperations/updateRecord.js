const Record = require("../../models/Records");

async function updateRecord(recordId, text, result) {
  try {
    const record = await Record.findById(recordId);

    if (!record) {
      console.log("Record not found");
      return;
    }

    const cleanedResult = result.map((item) => ({
      metaname: item.metaname,
      answer: item.answer === "true",
    }));

    record.text = text;
    record.result = cleanedResult;

    record.save();
  } catch (error) {
    console.log(error);
  }
}

module.exports = { updateRecord };
