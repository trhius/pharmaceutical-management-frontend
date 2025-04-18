import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";

import { CONFIG } from "src/config-global";

export const handleError = (err: any, defaultMessage: string) => {
  console.log(err)
  const { status, data } = err
  let message;
  if (!status) {
    message = "No Server Response";
  } else if (status === 401) {
    message = "Unauthorized";
  } else if (status === 400) {
    message = data.message || defaultMessage;
  } else {
    message = defaultMessage;
  }
  showErrorMessage(message || "Unexpected Error");
}

export const showSuccessMessage = (message: string) => {
  if (CONFIG.showSuccessMessage) {
    toast.success(message, {
      position: "top-right",
      autoClose: 500
    });
  }
}

export const showErrorMessage = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 1500
  });
}