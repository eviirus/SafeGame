const request = require("supertest");
const express = require("express");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const { convertFile } = require("../utils/fileConverter.js");
const {
  generateResultFromText,
} = require("../utils/generateResultFromText.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(fileUpload());

jest.mock("../utils/fileConverter.js", () => ({
  convertFile: jest.fn(),
}));

jest.mock("../utils/generateResultFromText.js", () => ({
  generateResultFromText: jest.fn(),
}));

app.post("/endpoints/convertFile", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.file;

  try {
    const result = await convertFile(file);

    if (result.success) {
      const response = await generateResultFromText(result);

      res.json({ ...result, ...response });
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

    if (!response) {
      throw new Error("Processing failed");
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

describe("POST /endpoints/convertFile", () => {
  it("should return 400 if no file is uploaded", async () => {
    const res = await request(app).post("/endpoints/convertFile").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No file uploaded");
  });

  it("should return 500 if conversion fails", async () => {
    const mockFileBuffer = Buffer.from("This is a mock PDF file content");

    convertFile.mockResolvedValue({ success: false });

    const res = await request(app)
      .post("/endpoints/convertFile")
      .attach("file", mockFileBuffer, "test.pdf");

    expect(res.status).toBe(500);
    expect(res.body.success).toBeFalsy();
  });

  it("should return 200 if conversion is successful", async () => {
    const mockFileBuffer = Buffer.from("This is a mock PDF file content");

    convertFile.mockResolvedValue({ success: true });

    generateResultFromText.mockResolvedValue({ result: "success" });

    const res = await request(app)
      .post("/endpoints/convertFile")
      .attach("file", mockFileBuffer, "test.pdf");

    expect(res.status).toBe(200);
    expect(res.body.result).toBe("success");
  });
});

describe("POST /endpoints/processText", () => {
  it("should return 400 if no text is provided", async () => {
    const res = await request(app).post("/endpoints/processText").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No text provided");
  });

  it("should return 500 if processing fails", async () => {
    const text = "Some text to process";

    generateResultFromText.mockResolvedValue(null);

    const res = await request(app)
      .post("/endpoints/processText")
      .send({ text });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal server error");
  });

  it("should return 200 if processing is successful", async () => {
    const text = "Some text to process";

    generateResultFromText.mockResolvedValue({ result: "Processed text" });

    const res = await request(app)
      .post("/endpoints/processText")
      .send({ text });

    expect(res.status).toBe(200);
    expect(res.body.result).toBe("Processed text");
  });
});
