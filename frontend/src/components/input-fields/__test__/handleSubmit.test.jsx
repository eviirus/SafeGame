jest.mock("axios", () => ({
  post: jest.fn(),
}));

import axios from "axios";
import { handleSubmit } from "../handleSubmit";

describe("handleSubmit function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  it("makes a request to processText with char count 999", async () => {
    const mockText = "T".repeat(999);

    const handleResultReceived = jest.fn();
    const handleGeneratedResult = jest.fn();

    await handleSubmit(
      mockText,
      null,
      null,
      "text",
      handleResultReceived,
      handleGeneratedResult
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Patikrinkite ar įklijavote pilną privatumo politikos tekstą"
    );

    expect(axios.post).not.toHaveBeenCalledWith(
      "http://localhost:5000/endpoints/processText",
      { text: mockText }
    );

    expect(handleResultReceived).toHaveBeenCalledWith(false);
    expect(handleGeneratedResult).toHaveBeenCalledWith([]);
  });

  it("makes a request to processText with char count 1000", async () => {
    const mockText = "T".repeat(1000);

    const handleResultReceived = jest.fn();
    const handleGeneratedResult = jest.fn();

    await handleSubmit(
      mockText,
      null,
      null,
      "text",
      handleResultReceived,
      handleGeneratedResult
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Patikrinkite ar įklijavote pilną privatumo politikos tekstą"
    );

    expect(axios.post).not.toHaveBeenCalledWith(
      "http://localhost:5000/endpoints/processText",
      { text: mockText }
    );

    expect(handleResultReceived).toHaveBeenCalledWith(false);
    expect(handleGeneratedResult).toHaveBeenCalledWith([]);
  });

  it("makes a request to processText with char count 1001", async () => {
    const mockText = "T".repeat(1001);

    const processTextResponse = { data: "Processed text result" };

    const handleResultReceived = jest.fn();
    const handleGeneratedResult = jest.fn();

    axios.post.mockResolvedValueOnce(processTextResponse);
    axios.post.mockResolvedValue({ data: {} });

    await handleSubmit(
      mockText,
      null,
      null,
      "text",
      handleResultReceived,
      handleGeneratedResult
    );

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/endpoints/processText",
      { text: mockText }
    );

    expect(window.alert).not.toHaveBeenCalled();
    expect(handleResultReceived).toHaveBeenCalledWith(false);
  });
});
