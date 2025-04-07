async function formatTextInput(text) {
  let formattedText = text.replace(/\s+/g, " ").trim();

  return formattedText;
}

module.exports = { formatTextInput };
