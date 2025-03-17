import * as pdfjsLib from "pdfjs-dist";

async function extractTextFromPDF(fileBuffer) {
    
    const uint8Array = new Uint8Array(fileBuffer.buffer); 

    
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        extractedText += pageText + "\n";
    }

    return extractedText;
}


async function convertFile(file) {
    console.log("Converting PDF...");

    try {
        if (!file || !file.data) {
            throw new Error("Invalid file input");
        }

        const text = await extractTextFromPDF(file.data);
        console.log("Extracted Text:\n", text);
        return { success: true, data: text };
    } catch (error) {
        console.error("Error extracting text:", error);
        return { success: false, error: error.message };
    }
}

export { convertFile };
  //module.exports = { convertFile };