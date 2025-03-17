const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { convertFile } = require("./utils/fileConverter");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(fileUpload());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.post("/endpoints/convertFile", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.file;

  const result = await convertFile(file);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

app.post("/endpoints/processText", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const processedText = text;

  res.json({ success: true, processedText });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
