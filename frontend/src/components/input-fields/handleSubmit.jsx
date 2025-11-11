import { toast } from "react-toastify";
import { inputHandlers } from "../../scripts/inputHandler";

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

  // sukurta atskira inputHandlers funkcija

  const handler = inputHandlers[inputType];
  if (handler) {
    handler(
      inputType === "text" ? inputValue : fileName,
      inputType === "file" ? file : undefined,
      handleResultReceived,
      handleGeneratedResult,
      questionsFullfilled,
      setPolicyTitle
    );
  } else {
    toast.error("Neteisingas įvesties tipas");
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
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => ({ category, items }));
};
