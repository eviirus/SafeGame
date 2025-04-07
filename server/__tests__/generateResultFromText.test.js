// __tests__/generateResultFromText.test.js

const { generateResultFromText } = require("../utils/generateResultFromText");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const QUESTIONS = [
  "Name",
  "Email address",
  "Phone number",
  "Physical address",
  "Date of birth",
  "Government ID numbers",
  "IP address",
  "Browser type and version",
  "Device identifiers",
  "Location data",
  "Payment card details",
  "Billing address",
  "Purchase history",
  "Health records",
  "Medical conditions or treatments",
  "Browsing history on the website or app",
  "Interaction with ads or content ",
  "Social media interactions",
  "Information shared with affiliates, partners, or advertisers",
  "Data collection by third parties",
  "Use of cookies for tracking purposes",
  "Third-party tracking technologies",
];

jest.mock("@google/generative-ai", () => {
  const mockGenerateContent = jest.fn().mockImplementation(() => ({
    response: {
      text: () => Promise.resolve("true false true false true false true false true false true false true false true false true false true false true false")
    }
  }));

  const mockGetGenerativeModel = jest.fn().mockImplementation(() => ({
    generateContent: mockGenerateContent
  }));

  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }))
  };
});

describe("generateResultFromText", () => {
  it("TA1 – turėtų grąžinti atsakymų masyvą su 'question' ir 'true/false'", async () => {
    const sampleText = "This is a sample privacy policy about user data collection.";

    const result = await generateResultFromText(sampleText);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(22);
    result.forEach(item => {
      expect(item).toHaveProperty("question");
      expect(["true", "false"]).toContain(item.answer);
    });
  });

  it("TA5 – DI grąžina tuščią atsakymą → sistema grąžina visur false", async () => {
    const emptyAnswer = "Atsiprasau bet negaliu";
    const mockText = "Some fake privacy policy content";

    const expectedFalseArray = QUESTIONS.map((question) => ({
      question,
      answer: "false",
    }));

    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: async () => ({
          response: {
            text: async () => emptyAnswer,
          },
        }),
      }),
    }));

    const result = await generateResultFromText(mockText);

    expect(result).toEqual(expectedFalseArray);
  });
});
