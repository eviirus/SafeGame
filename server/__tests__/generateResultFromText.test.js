const { generateResultFromText } = require("../utils/generateResultFromText");

jest.mock("@google/generative-ai", () => {
  const mockGenerateContent = jest.fn();
  const mockGetGenerativeModel = jest.fn(() => ({
    generateContent: mockGenerateContent,
  }));

  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    })),
  };
});

jest.mock("dotenv", () => ({ config: jest.fn() }));
jest.mock("../utils/textTokenization", () => ({
  splitTextByTokens: jest.fn((text) => [text]),
}));

describe("generateResultFromText", () => {
  let mockGenerateContent;

  beforeEach(() => {
    jest.clearAllMocks();
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const instance = new GoogleGenerativeAI();
    mockGenerateContent = instance.getGenerativeModel().generateContent;
  });

  it("turėtų grąžinti teisingai suformuotą atsakymų masyvą", async () => {
    const mockText = "true false true false true false true false true false true false true false true false true false true false true false";
    mockGenerateContent.mockResolvedValue({
      response: { text: jest.fn(() => mockText) },
    });

    const result = await generateResultFromText("privacy policy example text");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((r) => {
      expect(r).toHaveProperty("metaname");
      expect(["true", "false"]).toContain(r.answer);
    });
  });

  it("turėtų papildyti 'false' jei atsakymų mažiau nei klausimų", async () => {
    const mockText = "true false true false"; // mažiau nei klausimų
    mockGenerateContent.mockResolvedValue({
      response: { text: jest.fn(() => mockText) },
    });

    console.warn = jest.fn();
    const result = await generateResultFromText("short response");
    expect(console.warn).toHaveBeenCalled();
    expect(result.length).toBeGreaterThanOrEqual(22);
  });

  it("turėtų sutrumpinti atsakymus jei jų daugiau nei klausimų", async () => {
    const mockText = new Array(50).fill("true").join(" ");
    mockGenerateContent.mockResolvedValue({
      response: { text: jest.fn(() => mockText) },
    });

    console.warn = jest.fn();
    const result = await generateResultFromText("long response");
    expect(console.warn).toHaveBeenCalled();
    expect(result.length).toBe(22);
  });

  it("turėtų grąžinti klaidos objektą, kai model.generateContent meta klaidą", async () => {
    mockGenerateContent.mockRejectedValue(new Error("Modelio klaida"));

    const result = await generateResultFromText("some text");
    expect(result).toHaveProperty("success", false);
    expect(result.error).toMatch(/Modelio klaida/);
  });
});

