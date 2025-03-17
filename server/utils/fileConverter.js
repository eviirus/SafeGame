const { getDocument } = require("pdfjs-dist");

async function extractTextFromPDF(fileBuffer) {
  const uint8Array = new Uint8Array(fileBuffer.buffer);

  const pdf = await getDocument({ data: uint8Array }).promise;
  let extractedText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    extractedText += pageText + "\n";
  }

  return extractedText;
}

async function convertFile(file) {
  try {
    if (!file || !file.data) {
      throw new Error("Invalid file input");
    }

    const text = await extractTextFromPDF(file.data);
    return { success: true, data: text };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { convertFile };
