const MAX_TOKENS = 6000;
const text = "The Last Light of the LanternIn the quiet town of Rosedale, nestled between rolling hills and lush forests, lived a young The Last Light of the LanternIn the quiet town of Rosedale, nestled between rolling hills and lush";

function splitTextByTokens(text) {
    if (text.trim() === "") {
        return [];
    }

    const words = text.split(/\s+/); 
    const chunks = [];
    let currentChunk = [];
    let currentTokenCount = 0;

    words.forEach(word => {
        const wordTokenCount = word.length; 

        if (currentTokenCount + wordTokenCount > MAX_TOKENS) {
            if (currentChunk.length > 0) {
                chunks.push(currentChunk.join(' '));
            }
            currentChunk = [word];
            currentTokenCount = wordTokenCount;
        } else {
            currentChunk.push(word); 
            currentTokenCount += wordTokenCount; 
        }
    });

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    console.log(`Total chunks created: ${chunks.length}`);
    return chunks;
}

const textChunks = splitTextByTokens(text);

console.log("Final chunks:", textChunks);
module.exports = { splitTextByTokens, MAX_TOKENS };