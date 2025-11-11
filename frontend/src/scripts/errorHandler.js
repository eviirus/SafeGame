import { toast } from "react-toastify";

export const handleAxiosError = (error, defaultMessage) => {
  if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error(defaultMessage);
  }
};
