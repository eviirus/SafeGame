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

async function generateResultFromText(text) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const answerCounts = QUESTIONS.map(() => ({ true: 0, false: 0 }));

  const textChunks = splitTextByTokens(text);

  try {
    for (const chunk of textChunks) {
      const prompt =
        `Given the following privacy policy, answer true or false for whether each of the following types of data are collected:\n\n${chunk}\n\n` +
        QUESTIONS.join("\n") +
        "\n\nRespond only with 'true' or 'false' in the same order as the questions are listed.";

      const result = await model.generateContent(prompt, MAX_OUTPUT_TOKENS);
      const answerText = result.response.text().trim();

      const answers = answerText
        .split(/\s*,\s*|\s+/)
        .map((answer) => answer.trim().toLowerCase());

      if (answers.length < QUESTIONS.length) {
        console.warn(
          "Mismatch in answers length, filling with 'false' as fallback"
        );
        while (answers.length < QUESTIONS.length) {
          answers.push("false");
        }
      } else if (answers.length > QUESTIONS.length) {
        console.warn("Too many answers returned, trimming extra ones");
        answers.length = QUESTIONS.length;
      }

      answers.forEach((answer, index) => {
        if (answer === "true" || answer === "false") {
          answerCounts[index][answer]++;
        } else {
          answerCounts[index]["false"]++;
        }
      });
    }

    const finalAnswers = answerCounts.map(({ true: trueCount }, index) => {
      return {
        metaname: QUESTIONS[index],
        answer: trueCount !== 0 ? "true" : "false",
      };
    });

    console.log("FINAL ANSWERS", finalAnswers.flat());
    return finalAnswers;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { generateResultFromText };
