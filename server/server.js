const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const convertFileRoute = require("./routes/convertFile.js");
const processTextRoute = require("./routes/processText.js");
const generateResultFromText = require("./routes/generateResultFromText.js");
const leaveReview = require("./routes/leaveReview.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use("/endpoints/convertFile", convertFileRoute);
app.use("/endpoints/processText", processTextRoute);
app.use("/endpoints/generateResultFromText", generateResultFromText);
app.use("/endpoints/leaveReview", leaveReview);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
