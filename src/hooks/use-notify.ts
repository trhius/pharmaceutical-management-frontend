
import { showErrorMessage, showSuccessMessage } from "src/utils/notify";

export default function useNotify() {

  const handleError = (error: any) => {
    const { status, data } = error;
    let message;
    if (!status) {
      message = "No server response!";
    } else if (status === 401) {
      message = "Unauthorized request!";
    } else if (status === 400 && data.code) {
      message = "Bad request!";
    } else {
      message = "Something went wrong!";
    }
    showErrorMessage(message);
  }

  const showSuccessMsg = (message: string) => {
    showSuccessMessage(message);
  }

  const showCustomErrorMsg = (message: string) => {
    showErrorMessage(message);
  }

  return { handleError, showSuccessMsg, showCustomErrorMsg };
}