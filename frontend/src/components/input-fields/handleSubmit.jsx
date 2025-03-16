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

const handleTextInput = (inputValue) => {
  const MIN_INPUT_LENGTH = 1000;

  if (inputValue.length < MIN_INPUT_LENGTH) {
    alert("Patikrinkite ar įklijavote pilną privatumo politikos tekstą");
  } else {
    console.log("Sending input to server");
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
    console.log("Sending file to server");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/endpoints/convertFile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Įvyko klaida įkeliant failą į serverį");
    }
  } else {
    alert("Tik .pdf failai yra leidžiami");
  }
};
