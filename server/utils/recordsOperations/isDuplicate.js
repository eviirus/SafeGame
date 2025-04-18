const stringSimilarity = require("string-similarity");
const Record = require("../../models/Records");

async function isDuplicate(text) {
  try {
    const records = await Record.find({}, "text");
    for (let record of records) {
      const similarity = stringSimilarity.compareTwoStrings(text, record.text);
      if (similarity >= 0.8) {
        return record._id;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = { isDuplicate };
