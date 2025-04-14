const MIN_INPUT_LENGTH = 1000;
const MIN_WORD_COUNT = 500;
const MIN_UNIQUE_WORD_COUNT = 250;

async function formatTextInput(text) {
  const formattedText = text.replace(/\s+/g, " ").trim();
  const words = formattedText.match(/\p{L}+/gu) || [];
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()));

  return {
    formattedText,
    charCount: formattedText.length,
    wordCount: words.length,
    uniqueWordCount: uniqueWords.size,
  };
}

async function returnTextInputValue(text) {
  const result = await formatTextInput(text);

  if (result.charCount <= MIN_INPUT_LENGTH) {
    return {
      success: false,
      message: "Patikrinkite ar įkėlėte pilną privatumo politiką",
      errorMessage: "Not enough characters",
    };
  } else if (result.wordCount <= MIN_WORD_COUNT) {
    return {
      success: false,
      message: "Patikrinkite ar įkėlėte pilną privatumo politiką",
      errorMessage: "Not enough words",
    };
  } else if (result.uniqueWordCount <= MIN_UNIQUE_WORD_COUNT) {
    return {
      success: false,
      message: "Neįmanoma išanalizuoti. Patikrinkite privatumo politiką",
      errorMessage: "Not enough unique words",
    };
  }

  return {
    success: true,
    formattedText: result.formattedText,
  };
}

module.exports = { returnTextInputValue };
