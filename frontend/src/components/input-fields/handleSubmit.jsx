import axios from "axios";
import { toast } from "react-toastify";

export const handleSubmit = (
  inputValue,
  fileName,
  file,
  inputType,
  handleResultReceived,
  handleGeneratedResult,
  selectedCheckboxes,
  setPolicyTitle
) => {
  const questionsFullfilled = checkQuestionsInput(
    selectedCheckboxes,
    handleResultReceived,
    handleGeneratedResult
  );
  if (!questionsFullfilled) return;

  if (inputType === "text") {
    handleTextInput(
      inputValue,
      handleResultReceived,
      handleGeneratedResult,
      questionsFullfilled,
      setPolicyTitle
    );
  } else if (inputType === "file") {
    handleFileInput(
      fileName,
      file,
      handleResultReceived,
      handleGeneratedResult,
      questionsFullfilled,
      setPolicyTitle
    );
  }
};

const checkQuestionsInput = (
  selectedCheckboxes,
  handleResultReceived,
  handleGeneratedResult
) => {
  const selected = Object.values(selectedCheckboxes)
    .flat()
    .filter((items) => items.metaname).length;

  if (selected < 5) {
    toast.error("Pasirinkite bent 5 klausimus iš pateiktų filtrų");
    handleResultReceived(false);
    handleGeneratedResult([]);
    return false;
  }

  return Object.entries(selectedCheckboxes)
    .filter(([_, items]) => items.length > 0)
    .map(([category, items]) => ({
      category,
      items,
    }));
};

const handleTextInput = async (
  inputValue,
  handleResultReceived,
  handleGeneratedResult,
  questionsFullfilled,
  setPolicyTitle
) => {
  const receivedFormattedText = await prepareTextInput(inputValue);

  if (receivedFormattedText !== null && receivedFormattedText !== undefined) {
    generateResultFromText(
      receivedFormattedText,
      handleResultReceived,
      handleGeneratedResult,
      questionsFullfilled,
      setPolicyTitle
    );
  } else {
    handleResultReceived(false);
    handleGeneratedResult([]);
  }
};

const prepareTextInput = async (text) => {
  const MIN_INPUT_LENGTH = 1000;

  if (text.length <= MIN_INPUT_LENGTH) {
    toast.error("Patikrinkite ar įklijavote pilną privatumo politikos tekstą");
    return;
  }
  try {
    const formattedText = await axios.post(
      "http://localhost:5000/endpoints/processText",
      {
        text: text,
      }
    );

    return formattedText.data.formattedText;
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Įvyko klaida įkeliant tekstą į serverį");
    }

    return null;
  }
};

const handleFileInput = async (
  fileName,
  file,
  handleResultReceived,
  handleGeneratedResult,
  questionsFullfilled,
  setPolicyTitle
) => {
  const fileExtension = fileName.toLowerCase().split(".").pop();

  if (fileExtension !== "pdf") {
    toast.error("Tik .pdf failai yra leidžiami");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const receivedText = await convertFile(formData);

  if (receivedText !== null) {
    generateResultFromText(
      receivedText,
      handleResultReceived,
      handleGeneratedResult,
      questionsFullfilled,
      setPolicyTitle
    );
  } else {
    handleResultReceived(false);
    handleGeneratedResult([]);
  }
};

const convertFile = async (formData) => {
  try {
    const convertedText = await axios.post(
      "http://localhost:5000/endpoints/convertFile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return convertedText.data.formattedText;
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Įvyko klaida įkeliant failą į serverį");
    }

    return null;
  }
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
      "http://localhost:5000/endpoints/generateResultFromText",
      {
        text: text,
        questions: questionsFullfilled,
      }
    );

    if (response && response.data.success === false) {
      toast.error(
        "Įvyko netikėta klaida, bandykite pateikti privatumo politiką dar kartą."
      );
      handleResultReceived(false);
    } else {
      handleResultReceived(true);
      handleGeneratedResult(response.data);

      setPolicyTitle(text.slice(0, 47) + "...");

      toast.success("Analzė atlikta sėkmingai!");
    }
  } catch (error) {
    handleResultReceived(false);
    handleGeneratedResult([]);

    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Įvyko klaida generuojant rezultatą. Bandykite vėliau");
    }
  }
};
