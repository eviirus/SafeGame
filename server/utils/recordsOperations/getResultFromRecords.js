const Record = require("../../models/Records");

async function getResultFromRecords(recordId) {
  try {
    const record = await Record.findById(recordId);

    if (!record) {
      return { success: false, error: "Record not found" };
    }

    return record.result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { getResultFromRecords };