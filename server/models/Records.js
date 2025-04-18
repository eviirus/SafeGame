const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  metaname: { type: String, required: true },
  answer: { type: Boolean, required: true },
});

const recordsSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    result: { type: [itemSchema], required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Record", recordsSchema, "records");
