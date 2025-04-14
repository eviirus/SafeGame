import axios from "axios";

export const handleSubmit = (
  inputValue,
  fileName,
  file,
  inputType,
  handleResultReceived,
  handleGeneratedResult,
  setIsLoading
) => {
  handleResultReceived(false);
  handleGeneratedResult([]);

  if (inputType === "text") {
    handleTextInput(
      inputValue,
      handleResultReceived,
      handleGeneratedResult,
      setIsLoading
    );
  } else if (inputType === "link") {
    handleLinkInput(inputValue, setIsLoading);
  } else if (inputType === "file") {
    handleFileInput(
      fileName,
      file,
      handleResultReceived,
      handleGeneratedResult,
      setIsLoading
    );
  }
};

const handleTextInput = async (
  inputValue,
  handleResultReceived,
  handleGeneratedResult,
  setIsLoading
) => {
  const receivedFormattedText = await prepareTextInput(inputValue);

  console.log(receivedFormattedText);

  if (receivedFormattedText !== null && receivedFormattedText !== undefined)
    generateResultFromText(
      receivedFormattedText,
      handleResultReceived,
      handleGeneratedResult,
      setIsLoading
    );
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

const handleLinkInput = (inputValue) => {
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
  setIsLoading
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
      receivedText,
      handleResultReceived,
      handleGeneratedResult,
      setIsLoading
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
  setIsLoading
) => {
  try {
    setIsLoading(true);

    const response = await axios.post(
      "http://localhost:5000/endpoints/generateResultFromText",
      {
        text: text,
      }
    );
    setIsLoading(false);
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
    setIsLoading(false);
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Įvyko klaida generuojant rezultatą. Bandykite vėliau");
    }
  } finally {
    setIsLoading(false);
  }
};
