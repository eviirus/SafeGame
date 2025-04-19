import axios from "axios";

export const handleSubmit = (
  inputValue,
  fileName,
  file,
  inputType,
  handleResultReceived,
  handleGeneratedResult,
  selectedCheckboxes
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
      questionsFullfilled
    );
  } else if (inputType === "link") {
    handleLinkInput(inputValue, questionsFullfilled);
  } else if (inputType === "file") {
    handleFileInput(
      fileName,
      file,
      handleResultReceived,
      handleGeneratedResult,
      questionsFullfilled
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
    alert("Pasirinkite bent 5 klausimus iš pateiktų filtrų");
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
  questionsFullfilled
) => {
  const receivedFormattedText = await prepareTextInput(inputValue);

  if (receivedFormattedText !== null && receivedFormattedText !== undefined) {
    generateResultFromText(
      receivedFormattedText,
      handleResultReceived,
      handleGeneratedResult,
      questionsFullfilled
    );
  } else {
    handleResultReceived(false);
    handleGeneratedResult([]);
  }
};

const prepareTextInput = async (text) => {
  const MIN_INPUT_LENGTH = 1000;

  if (text.length <= MIN_INPUT_LENGTH) {
    alert("Patikrinkite ar įklijavote pilną privatumo politikos tekstą");
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
      alert(error.response.data.message);
    } else {
      alert("Įvyko klaida įkeliant tekstą į serverį");
    }

    return null;
  }
};

const handleLinkInput = (inputValue, questionsFullfilled) => {
  const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;

  if (urlRegex.test(inputValue)) {
    console.log("Sending link to server");
  } else {
    alert("Įvesta neteisinga nuoroda");
  }
};

const handleFileInput = async (
  fileName,
  file,
  handleResultReceived,
  handleGeneratedResult,
  questionsFullfilled
) => {
  const fileExtension = fileName.toLowerCase().split(".").pop();

  if (fileExtension !== "pdf") {
    alert("Tik .pdf failai yra leidžiami");
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
      questionsFullfilled
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
      alert(error.response.data.message);
    } else {
      alert("Įvyko klaida įkeliant failą į serverį");
    }

    return null;
  }
};

const generateResultFromText = async (
  text,
  handleResultReceived,
  handleGeneratedResult,
  questionsFullfilled
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
      alert(
        "Įvyko netikėta klaida, bandykite pateikti privatumo politiką dar kartą."
      );
      handleResultReceived(false);
    } else {
      handleResultReceived(true);
      handleGeneratedResult(response.data);
      console.log(response.data);
    }
  } catch (error) {
    handleResultReceived(false);
    handleGeneratedResult([]);

    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Įvyko klaida generuojant rezultatą. Bandykite vėliau");
    }
  }
};
