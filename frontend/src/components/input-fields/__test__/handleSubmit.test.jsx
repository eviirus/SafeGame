jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import axios from "axios";
import { toast } from "react-toastify";
import { handleSubmit } from "../handleSubmit";

const validCheckboxes = [
  { metaname: "Government ID numbers", name: "Asmens kodas" },
  { metaname: "Date of birth", name: "Gimimo data" },
  { metaname: "Phone number", name: "Telefono numeris" },
  { metaname: "Physical address", name: "Adresas" },
  { metaname: "Email address", name: "El. paštas" },
];

const invalidCheckboxes = [
  { metaname: "Government ID numbers", name: "Asmens kodas" },
];

describe("handleSubmit extended coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns early when fewer than 5 questions selected", async () => {
    const mockFn = jest.fn();
    await handleSubmit(
      "text",
      null,
      null,
      "text",
      mockFn,
      mockFn,
      invalidCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Pasirinkite bent 5 klausimus iš pateiktų filtrų"
    );
    expect(mockFn).toHaveBeenCalledWith(false);
  });

  it("handles invalid text (<= 1000 chars)", async () => {
    const shortText = "a".repeat(500);
    const mockFn = jest.fn();

    await handleSubmit(
      shortText,
      null,
      null,
      "text",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Patikrinkite ar įklijavote pilną privatumo politikos tekstą"
    );
  });

  it("handles axios error without response in text input", async () => {
    const longText = "a".repeat(1200);
    axios.post.mockRejectedValueOnce(new Error("network fail"));

    const mockFn = jest.fn();

    await handleSubmit(
      longText,
      null,
      null,
      "text",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Įvyko klaida įkeliant tekstą į serverį"
    );
  });

  it("handles axios error with response in text input", async () => {
    const longText = "a".repeat(1200);
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Server message" } },
    });

    const mockFn = jest.fn();

    await handleSubmit(
      longText,
      null,
      null,
      "text",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith("Server message");
  });

  it("handles valid text input -> successful generateResultFromText", async () => {
    const longText = "a".repeat(1201);
    const fakeFormatted = { data: { formattedText: "Formatted text" } };
    const fakeGenerateResult = {
      data: { success: true, result: "ok" },
    };
    axios.post
      .mockResolvedValueOnce(fakeFormatted)
      .mockResolvedValueOnce(fakeGenerateResult);

    const mockHandleResultReceived = jest.fn();
    const mockHandleGeneratedResult = jest.fn();
    const mockSetPolicyTitle = jest.fn();

    await handleSubmit(
      longText,
      null,
      null,
      "text",
      mockHandleResultReceived,
      mockHandleGeneratedResult,
      validCheckboxes,
      mockSetPolicyTitle
    );

    expect(mockHandleResultReceived).toHaveBeenCalledWith(true);
    expect(mockHandleGeneratedResult).toHaveBeenCalledWith(
      fakeGenerateResult.data
    );
    expect(mockSetPolicyTitle).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Analizė atlikta sėkmingai!");
  });

  it("handles generateResultFromText with success=false", async () => {
    const longText = "a".repeat(1201);
    const fakeFormatted = { data: { formattedText: "Formatted text" } };
    const fakeGenerateResult = { data: { success: false } };
    axios.post
      .mockResolvedValueOnce(fakeFormatted)
      .mockResolvedValueOnce(fakeGenerateResult);

    const mockHandleResultReceived = jest.fn();
    const mockHandleGeneratedResult = jest.fn();

    await handleSubmit(
      longText,
      null,
      null,
      "text",
      mockHandleResultReceived,
      mockHandleGeneratedResult,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Įvyko netikėta klaida, bandykite pateikti privatumo politiką dar kartą."
    );
  });

  it("handles generateResultFromText axios error", async () => {
    const longText = "a".repeat(1201);
    const fakeFormatted = { data: { formattedText: "Formatted text" } };
    axios.post
      .mockResolvedValueOnce(fakeFormatted)
      .mockRejectedValueOnce({ response: { data: { message: "Error" } } });

    const mockFn = jest.fn();

    await handleSubmit(
      longText,
      null,
      null,
      "text",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  it("handles file input with non-PDF extension", async () => {
    const mockFn = jest.fn();

    await handleSubmit(
      null,
      "file.txt",
      {},
      "file",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith("Tik .pdf failai yra leidžiami");
  });

  it("handles file input with axios error (no response)", async () => {
    const file = new Blob(["file content"], { type: "application/pdf" });
    axios.post.mockRejectedValueOnce(new Error("fail"));

    const mockFn = jest.fn();

    await handleSubmit(
      null,
      "file.pdf",
      file,
      "file",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Įvyko klaida įkeliant failą į serverį"
    );
  });

  it("handles file input with axios error (with response)", async () => {
    const file = new Blob(["file content"], { type: "application/pdf" });
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Server fail" } },
    });

    const mockFn = jest.fn();

    await handleSubmit(
      null,
      "file.pdf",
      file,
      "file",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith("Server fail");
  });

  it("handles file input with successful convert and generateResult", async () => {
    const file = new Blob(["file content"], { type: "application/pdf" });
    const fakeConverted = { data: { formattedText: "PDF text" } };
    const fakeGenerated = { data: { success: true } };

    axios.post
      .mockResolvedValueOnce(fakeConverted)
      .mockResolvedValueOnce(fakeGenerated);

    const mockFn = jest.fn();
    const mockSetPolicyTitle = jest.fn();

    await handleSubmit(
      null,
      "file.pdf",
      file,
      "file",
      mockFn,
      mockFn,
      validCheckboxes,
      mockSetPolicyTitle
    );

    expect(mockFn).toHaveBeenCalledWith(true);
    expect(toast.success).toHaveBeenCalledWith("Analizė atlikta sėkmingai!");
  });

  it("handles unknown input type", async () => {
    const mockFn = jest.fn();
    await handleSubmit(
      null,
      null,
      null,
      "unknown",
      mockFn,
      mockFn,
      validCheckboxes
    );

    expect(toast.error).not.toHaveBeenCalledWith("Neteisingas įvesties tipas");
  });
});
