const request = require("supertest");
const express = require("express");

// Importuojam testuojamą router
const router = require("../../routes/generateResultFromText");

// Sukuriam Express app su mūsų router
const app = express();
app.use(express.json());
app.use("/generateResultFromText", router);

// Mockinam visus dependent modulius
jest.mock("../../utils/generateResultFromText", () => ({
  generateResultFromText: jest.fn(),
}));
jest.mock("../../utils/formatOutput", () => ({
  formatOutput: jest.fn(),
}));
jest.mock("../../utils/recordsOperations/isDuplicate", () => ({
  isDuplicate: jest.fn(),
}));
jest.mock("../../utils/recordsOperations/createNewRecord", () => ({
  createNewRecord: jest.fn(),
}));
jest.mock("../../utils/recordsOperations/shouldBeUpdated", () => ({
  shouldBeUpdated: jest.fn(),
}));
jest.mock("../../utils/recordsOperations/updateRecord", () => ({
  updateRecord: jest.fn(),
}));
jest.mock("../../utils/recordsOperations/getResultFromRecords", () => ({
  getResultFromRecords: jest.fn(),
}));

const {
  generateResultFromText,
} = require("../../utils/generateResultFromText");
const { formatOutput } = require("../../utils/formatOutput");
const { isDuplicate } = require("../../utils/recordsOperations/isDuplicate");
const { createNewRecord } = require("../../utils/recordsOperations/createNewRecord");
const { shouldBeUpdated } = require("../../utils/recordsOperations/shouldBeUpdated");
const { updateRecord } = require("../../utils/recordsOperations/updateRecord");
const { getResultFromRecords } = require("../../utils/recordsOperations/getResultFromRecords");

describe("POST /generateResultFromText", () => {
  const sampleText = "Test privacy policy";
  const sampleQuestions = ["Name", "Email"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("TA1 – kai nėra dublikato → sukuria naują įrašą", async () => {
    isDuplicate.mockResolvedValue(null);
    generateResultFromText.mockResolvedValue([{ metaname: "Name", answer: "true" }]);
    formatOutput.mockResolvedValue({ success: true, data: "formatted" });
    createNewRecord.mockResolvedValue();

    const response = await request(app)
      .post("/generateResultFromText")
      .send({ text: sampleText, questions: sampleQuestions });

    expect(isDuplicate).toHaveBeenCalledWith(sampleText);
    expect(createNewRecord).toHaveBeenCalled();
    expect(formatOutput).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("TA2 – kai reikia atnaujinti įrašą", async () => {
    isDuplicate.mockResolvedValue("record123");
    shouldBeUpdated.mockResolvedValue(true);
    generateResultFromText.mockResolvedValue([{ metaname: "Name", answer: "true" }]);
    formatOutput.mockResolvedValue({ success: true, data: "updated" });
    updateRecord.mockResolvedValue();

    const response = await request(app)
      .post("/generateResultFromText")
      .send({ text: sampleText, questions: sampleQuestions });

    expect(updateRecord).toHaveBeenCalled();
    expect(formatOutput).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("TA3 – kai yra įrašas ir sėkmingai gaunamas iš DB", async () => {
    isDuplicate.mockResolvedValue("record123");
    shouldBeUpdated.mockResolvedValue(false);
    getResultFromRecords.mockResolvedValue({ success: true, data: "fromDB" });
    formatOutput.mockResolvedValue({ success: true, result: "ok" });

    const response = await request(app)
      .post("/generateResultFromText")
      .send({ text: sampleText, questions: sampleQuestions });

    expect(getResultFromRecords).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("TA4 – kai duomenų bazės įrašas netinkamas → generuoja naują rezultatą", async () => {
    isDuplicate.mockResolvedValue("record123");
    shouldBeUpdated.mockResolvedValue(false);
    getResultFromRecords.mockResolvedValue({ success: false });
    generateResultFromText.mockResolvedValue([{ metaname: "Name", answer: "false" }]);
    formatOutput.mockResolvedValue({ success: true, result: "ok" });

    const response = await request(app)
      .post("/generateResultFromText")
      .send({ text: sampleText, questions: sampleQuestions });

    expect(getResultFromRecords).toHaveBeenCalled();
    expect(generateResultFromText).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
  });

  it("TA5 – kai formatOutput grąžina klaidą → 500", async () => {
    isDuplicate.mockResolvedValue(null);
    generateResultFromText.mockResolvedValue([{ metaname: "Name", answer: "true" }]);
    formatOutput.mockResolvedValue({ success: false, error: "Formatting failed" });

    const response = await request(app)
      .post("/generateResultFromText")
      .send({ text: sampleText, questions: sampleQuestions });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
  });

  it("TA6 – kai įvyksta klaida (throw error) → 500", async () => {
    isDuplicate.mockRejectedValue(new Error("DB connection failed"));

    const response = await request(app)
      .post("/generateResultFromText")
      .send({ text: sampleText, questions: sampleQuestions });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("DB connection failed");
  });
});
