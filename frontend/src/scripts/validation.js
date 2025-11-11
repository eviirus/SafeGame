import { toast } from "react-toastify";
import { MIN_INPUT_LENGTH } from "./config";

export const isValidText = (text) => {
  if (!text || text.length <= MIN_INPUT_LENGTH) {
    toast.error("Patikrinkite ar įklijavote pilną privatumo politikos tekstą");
    return false;
  }
  return true;
};

export const isValidFile = (filename) => {
  const extension = filename.toLowerCase().split(".").pop();
  if (extension !== "pdf") {
    toast.error("Tik .pdf failai yra leidžiami");
    return false;
  }
  return true;
};
