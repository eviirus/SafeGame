const { splitTextByTokens } = require("../utils/textTokenization");

describe("splitTextByTokens", () => {
  test("should not split text if it is within the token limit", () => {
    const text = "This is a short text that doesn't exceed the token limit.";
    const result = splitTextByTokens(text);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(text);
  });

  test("should split text into multiple chunks if it exceeds the token limit", () => {
    const text = "ab ".repeat(1000000);
    const result = splitTextByTokens(text);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0].length).toBeGreaterThan(0);
  });

  test("should handle text with one word exceeding the token limit", () => {
    const text = "supercalifragilisticexpialidocious";
    const result = splitTextByTokens(text);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(text);
  });

  test("should handle empty text", () => {
    const text = "";
    const result = splitTextByTokens(text);
    expect(result.length).toBe(0);
  });

  test("should handle text with only spaces", () => {
    const text = "     ";
    const result = splitTextByTokens(text);
    expect(result.length).toBe(0);
  });

  test("should correctly split text at exact token limit", () => {
    const MAX_TOKENS = 100000;
    const text = "a".repeat(MAX_TOKENS);
    const result = splitTextByTokens(text);
    expect(result.length).toBe(1);
    expect(result[0].length).toBe(MAX_TOKENS);
  });
}); //delete this
