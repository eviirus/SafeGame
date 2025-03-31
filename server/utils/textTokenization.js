const MAX_TOKENS = 100000;

function splitTextByTokens(text) {
  if (text.trim() === "") {
    return [];
  }

  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let currentTokenCount = 0;

  words.forEach((word) => {
    const wordTokenCount = word.length;

    if (currentTokenCount + wordTokenCount > MAX_TOKENS) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(" "));
      }
      currentChunk = [word];
      currentTokenCount = wordTokenCount;
    } else {
      currentChunk.push(word);
      currentTokenCount += wordTokenCount;
    }
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}

module.exports = { splitTextByTokens };