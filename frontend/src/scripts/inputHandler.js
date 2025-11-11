import axios from "axios";
import { toast } from "react-toastify";

// API_BASE_URL iskelta i konfiguraciju faila
import { API_BASE_URL } from "./config";

// pasikartojantis kodas iskeltas i atskira funkcija
import { handleAxiosError } from "./errorHandler";

// validacija iskelta i atskiras funkcijas
import { isValidText, isValidFile } from "./validation";

export const inputHandlers = {
  text: async (
    inputValue,
    handleResultReceived,
    handleGeneratedResult,
    questionsFullfilled,
    setPolicyTitle
  ) => {
    if (!isValidText(inputValue)) return;

    try {
      const { data } = await axios.post(`${API_BASE_URL}/processText`, {
        text: inputValue,
      });
      const formattedText = data.formattedText;
      await generateResultFromText(
        formattedText,
        handleResultReceived,
        handleGeneratedResult,
        questionsFullfilled,
        setPolicyTitle
      );
    } catch (error) {
      handleAxiosError(error, "Įvyko klaida įkeliant tekstą į serverį");
    }
  },

  file: async (
    fileName,
    file,
    handleResultReceived,
    handleGeneratedResult,
    questionsFullfilled,
    setPolicyTitle
  ) => {
    if (!isValidFile(fileName)) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/convertFile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const receivedText = data.formattedText;

      await generateResultFromText(
        receivedText,
        handleResultReceived,
        handleGeneratedResult,
        questionsFullfilled,
        setPolicyTitle
      );
    } catch (error) {
      handleAxiosError(error, "Įvyko klaida įkeliant failą į serverį");
    }
  },
};

const generateResultFromText = async (
  text,
  handleResultReceived,
  handleGeneratedResult,
  questionsFullfilled,
  setPolicyTitle
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/generateResultFromText`,
      {
        text,
        questions: questionsFullfilled,
      }
    );

    if (response?.data?.success === false) {
      toast.error(
        "Įvyko netikėta klaida, bandykite pateikti privatumo politiką dar kartą."
      );
      handleResultReceived(false);
      return;
    }

    handleResultReceived(true);
    handleGeneratedResult(response.data);
    setPolicyTitle(text.slice(0, 47) + "...");
    toast.success("Analizė atlikta sėkmingai!");
  } catch (error) {
    handleResultReceived(false);
    handleGeneratedResult([]);
    handleAxiosError(
      error,
      "Įvyko klaida generuojant rezultatą. Bandykite vėliau"
    );
  }
};
