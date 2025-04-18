const Record = require("../../models/Records");

async function shouldBeUpdated(recordId) {
  try {
    const record = await Record.findById(recordId);

    if (!record) {
      console.log("Record not found");
      return false;
    }

    const currentDate = new Date();

    const timeDifference = currentDate - record.updatedAt;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference >= 30;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = { shouldBeUpdated };
