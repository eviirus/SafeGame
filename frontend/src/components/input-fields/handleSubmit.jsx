import axios from "axios";

export const handleSubmit = (
  inputValue,
  fileName,
  file,
  inputType,
  handleResultReceived,
  handleGeneratedResult
) => {
  handleResultReceived(false);
  handleGeneratedResult([]);
  if (inputType === "text") {
    handleTextInput(inputValue, handleResultReceived, handleGeneratedResult);
  } else if (inputType === "link") {
    handleLinkInput(inputValue);
  } else if (inputType === "file") {
    handleFileInput(
      fileName,
      file,
      handleResultReceived,
      handleGeneratedResult
    );
  }
};

const handleTextInput = async (
  inputValue,
  handleResultReceived,
  handleGeneratedResult
) => {
  const receivedFormattedText = await prepareTextInput(inputValue);

  if (receivedFormattedText !== null)
    generateResultFromText(
      receivedFormattedText,
      handleResultReceived,
      handleGeneratedResult
    );
};

const prepareTextInput = async (text) => {
  const MIN_INPUT_LENGTH = 1000;

  if (text.length < MIN_INPUT_LENGTH) {
    alert("Patikrinkite ar įklijavote pilną privatumo politikos tekstą");
  } else {
    try {
      const formattedText = await axios.post(
        "http://localhost:5000/endpoints/processText",
        {
          text: text,
        }
      );

      return formattedText.data;
    } catch (error) {
      alert("Įvyko klaida įkeliant tekstą į serverį");

      return null;
    }
  }
};

const handleLinkInput = (inputValue) => {
  const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;

  if (urlRegex.test(inputValue)) {
    console.log("Sending link to server");
  } else {
    alert("Patikrinkite įvesta nuorodą");
  }
};

const handleFileInput = async (
  fileName,
  file,
  handleResultReceived,
  handleGeneratedResult
) => {
  const fileExtension = fileName.toLowerCase().split(".").pop();

  if (fileExtension !== "pdf") {
    alert("Tik .pdf failai yra leidžiami");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const receivedText = await convertFile(formData);

  if (receivedText !== null)
    generateResultFromText(
      receivedText.data,
      handleResultReceived,
      handleGeneratedResult
    );
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

    return convertedText.data;
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
  handleGeneratedResult
) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/endpoints/generateResultFromText",
      {
        text: text,
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
    }
  } catch (error) {
    alert("Įvyko klaida generuojant rezultatą");
  }
};
