import axios from "axios";

export const handleSubmit = (inputValue, fileName, file, inputType) => {
  console.log("form submitted with input:", inputValue, "file:", fileName);
  console.log(inputType);

  if (inputType === "text") {
    handleTextInput(inputValue);
  } else if (inputType === "link") {
    handleLinkInput(inputValue);
  } else if (inputType === "file") {
    handleFileInput(fileName, file);
  }
};

const handleTextInput = async (inputValue) => {
  const MIN_INPUT_LENGTH = 1000;

  if (inputValue.length < MIN_INPUT_LENGTH) {
    alert("Patikrinkite ar įklijavote pilną privatumo politikos tekstą");
  } else {
    try {
      await axios.post("http://localhost:5000/endpoints/processText", {
        text: inputValue,
      });
    } catch (error) {
      alert("Įvyko klaida įkeliant tekstą į serverį");
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

const handleFileInput = async (fileName, file) => {
  const fileExtension = fileName.toLowerCase().split(".").pop();

  if (fileExtension === "pdf") {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:5000/endpoints/convertFile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (error) {
      alert("Įvyko klaida įkeliant failą į serverį");
    }
  } else {
    alert("Tik .pdf failai yra leidžiami");
  }
};
