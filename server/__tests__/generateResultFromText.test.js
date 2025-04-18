const { generateResultFromText } = require("../utils/generateResultFromText");

jest.mock("@google/generative-ai", () => {
  const mockText =
    "true false true false true false true false true false true false true false true false true false true false true false";

  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
      text: jest.fn().mockReturnValue(mockText),
    },
  });

  const mockGetGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  });

  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    })),
  };
});

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

jest.mock("../utils/textTokenization", () => ({
  splitTextByTokens: jest.fn().mockImplementation((text) => [text]),
}));

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

describe("generateResultFromText", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    if (global.answerCounts) {
      global.answerCounts = QUESTIONS.map(() => ({ true: 0, false: 0 }));
    }
  });

  it("TA1 – turėtų grąžinti atsakymų masyvą su 'metaname' ir 'true/false'", async () => {
    const sampleText =
      "This is a sample privacy policy about user data collection.";

    const result = await generateResultFromText(sampleText);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(22);

    result.forEach((item) => {
      expect(item).toHaveProperty("metaname");
      expect(["true", "false"]).toContain(item.answer);
    });
  });

  // it("TA5 – DI grąžina tuščią atsakymą → sistema grąžina visur false", async () => {
  //   const emptyAnswer = "Atsiprasau bet negaliu";
  //   const mockText = "Some fake privacy policy content";

  //   const expectedFalseArray = QUESTIONS.map((metaname) => ({
  //     metaname,
  //     answer: "false",
  //   }));

  //   GoogleGenerativeAI.mockImplementation(() => ({
  //     getGenerativeModel: () => ({
  //       generateContent: async () => ({
  //         response: {
  //           text: async () => emptyAnswer,
  //         },
  //       }),
  //     }),
  //   }));

  //   const result = await generateResultFromText(mockText);

  //   expect(result).toEqual(expectedFalseArray);
  // });
});
