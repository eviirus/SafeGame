const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const { convertFile } = require("./utils/fileConverter.js");
const { generateResultFromText } = require("./utils/generateResultFromText.js");

dotenv.config();

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

  try {
    const result = await convertFile(file);

    if (result.success) {
      const response = await generateResultFromText(result);

      res.json(result);
      res.json(response);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/endpoints/processText", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const response = await generateResultFromText(text);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
