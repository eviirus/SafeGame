const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const { splitTextByTokens } = require("../utils/textTokenization");

dotenv.config({ path: "../.env" });

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
  "Interaction with ads or content",
  "Social media interactions",
  "Information shared with affiliates, partners, or advertisers",
  "Data collection by third parties",
  "Use of cookies for tracking purposes",
  "Third-party tracking technologies",
];

const MAX_OUTPUT_TOKENS = 100;

function buildPrompt(chunk) {
  return (
    `Given the following privacy policy, answer true or false for whether each of the following types of data are collected:\n\n${chunk}\n\n` +
    QUESTIONS.join("\n") +
    "\n\nRespond only with 'true' or 'false' in the same order as the questions are listed."
  );
}

function normalizeAnswers(answers, expectedLength) {
  if (answers.length < expectedLength) {
    console.warn("Mismatch in answers length, filling with 'false' as fallback");
    while (answers.length < expectedLength) answers.push("false");
  } else if (answers.length > expectedLength) {
    console.warn("Too many answers returned, trimming extra ones");
    answers.length = expectedLength;
  }
  return answers;
}

function handleError(error, message) {
  console.error(message, error.message);
  return { success: false, error: error.message };
}


async function generateResultFromText(text) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const answerStats = QUESTIONS.map(() => ({ trueCount: 0, falseCount: 0 }));
  const textChunks = splitTextByTokens(text);

  try {
    for (const chunk of textChunks) {
      const prompt = buildPrompt(chunk);
      const result = await model.generateContent(prompt, MAX_OUTPUT_TOKENS);
      const answerText = result.response.text().trim();

      const answers = answerText
        .split(/\s*,\s*|\s+/)
        .map((a) => a.trim().toLowerCase());

      const normalized = normalizeAnswers(answers, QUESTIONS.length);

      for (let index = 0; index < normalized.length; index++) {
        const answer = normalized[index];
        
        if (answer === "true") answerStats[index].trueCount++;
        else answerStats[index].falseCount++;
      }
    }

    const finalAnswers = answerStats.map(({ trueCount }, index) => ({
      metaname: QUESTIONS[index],
      answer: trueCount > 0 ? "true" : "false",
    }));

    console.log("FINAL ANSWERS", finalAnswers);
    return finalAnswers;
  } catch (error) {
    return handleError(error, "Error generating results from text");
  }
}

module.exports = { generateResultFromText };