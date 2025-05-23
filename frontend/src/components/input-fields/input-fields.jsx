import React, { useState, useRef } from "react";
import "../input-fields/input-fields.css";
import pdfImage from "../../assets/images/pdf-image.png";
import { handleSubmit } from "./handleSubmit";
import LoadingSpinner from "../loading-spinner/loading-spinner";

function Input({
  handleResultReceived,
  handleGeneratedResult,
  selectedCheckboxes,
  setPolicyTitle,
}) {
  const [placeholder, setPlaceholder] = useState("Tekstą įklijuokite čia");
  const [activeButton, setActiveButton] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputButtonClick = (event) => {
    const inputType = event.currentTarget.getAttribute("data-input-type");
    setPlaceholder(event.currentTarget.getAttribute("data-placeholder"));
    setActiveButton(inputType);
    setInputValue("");
    setFileName("");
  };

  const handleInputChange = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

    setInputValue(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
      setPlaceholder(file.name);
    }
  };

  const onSubmit = (inputValue, fileName, file, inputType) => {
    setIsLoading(true);
    handleSubmit(
      inputValue,
      fileName,
      file,
      inputType,
      (result) => {
        handleResultReceived(result);
        setIsLoading(false);
      },
      (generatedResult) => {
        handleGeneratedResult(generatedResult);
      },
      selectedCheckboxes,
      setPolicyTitle
    );
  };

  const isSubmitDisabled = !inputValue && !fileName;
  const showSubmitButton = (inputValue || fileName) && !isLoading;

  return (
    <div className="input-fields">
      <div className="buttons">
        <button
          type="button"
          data-input-type="text"
          data-placeholder="Tekstą įklijuokite čia"
          data-active={activeButton === "text" ? "true" : "false"}
          onClick={handleInputButtonClick}
        >
          <span className="title">Iš teksto</span>
          <span className="subtitle">Struktūrizuoti iš teksto</span>
        </button>
        <button
          type="button"
          data-input-type="file"
          data-placeholder="Dokumentą nuvilkite čia arba"
          data-active={activeButton === "file" ? "true" : "false"}
          onClick={handleInputButtonClick}
        >
          <span className="title">Iš failo</span>
          <span className="subtitle">Struktūrizuoti iš .pdf</span>
        </button>
      </div>
      <div className="input-field">
        {activeButton === "file" ? (
          <div className="file-input-container">
            <input
              type="file"
              accept=".pdf"
              id="fileInput"
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" className="file-input-label">
              <img src={pdfImage} alt="PDF icon" loading="lazy" />
              <div className="text">
                <p>{placeholder}</p>
                <p className="button-visual">
                  {fileName
                    ? "Pasirinkti kitą"
                    : "Pasirinkite iš savo įrenginio"}
                </p>
              </div>
            </label>
          </div>
        ) : activeButton === "text" ? (
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={inputValue}
            onInput={handleInputChange}
          />
        ) : null}
      </div>
      {showSubmitButton && (
        <button
          type="button"
          onClick={() => onSubmit(inputValue, fileName, file, activeButton)}
          disabled={isSubmitDisabled}
          className="submit-button"
        >
          Pateikti
        </button>
      )}
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default Input;
