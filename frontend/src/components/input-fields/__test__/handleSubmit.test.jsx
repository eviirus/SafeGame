jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

import axios from "axios";
import { handleSubmit } from "../handleSubmit";
import { toast } from "react-toastify";

const selectedCheckboxes = [
  {
    metaname: "Government ID numbers",
    name: "Asmens kodas",
  },
  {
    metaname: "Date of birth",
    name: "Gimimo data",
  },
  {
    metaname: "Phone number",
    name: "Telefono numeris",
  },
  {
    metaname: "Physical address",
    name: "Adresas",
  },
  {
    metaname: "Email address",
    name: "El. paštas",
  },
];

describe("handleSubmit function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      handleGeneratedResult,
      selectedCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith(
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
      handleGeneratedResult,
      selectedCheckboxes
    );

    expect(toast.error).toHaveBeenCalledWith(
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
      handleGeneratedResult,
      selectedCheckboxes
    );

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/endpoints/processText",
      { text: mockText }
    );

    expect(toast.error).not.toHaveBeenCalled();
  });
});
