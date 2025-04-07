const { convertFile } = require("../utils/fileConverter");
const { getDocument } = require("pdfjs-dist");

jest.mock("pdfjs-dist", () => ({
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({
      numPages: 2,
      getPage: jest.fn((pageNum) =>
        Promise.resolve({
          getTextContent: jest.fn().mockResolvedValue({
            items: [{ str: `This is page ${pageNum}` }],
          }),
        })
      ),
    }),
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("convertFile", () => {
  it("should return the extracted text from a PDF", async () => {
    const file = { data: Buffer.from("dummy pdf file data") };

    const result = await convertFile(file);

    console.log("Test result:", result);

    expect(result.success).toBe(true);
    expect(result.data).toBe("This is page 1 This is page 2");
  });

  it("should throw an error if the file input is invalid", async () => {
    const result = await convertFile(null);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid file input");
  });

  it("should handle PDF extraction errors gracefully", async () => {
    getDocument.mockImplementation(() => ({
      promise: Promise.reject(new Error("Failed to extract PDF")),
    }));

    const file = { data: Buffer.from("dummy pdf file data") };

    const result = await convertFile(file);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to extract PDF");
  });
});
