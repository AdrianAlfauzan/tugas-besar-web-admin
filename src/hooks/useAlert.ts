// src/hooks/useAlert.ts
import { useState } from "react";

interface AlertResult {
  alertMessage: string | null;
  isSuccess: boolean | null;
  setAlertMessage: (message: string, success: boolean) => void;
  clearAlert: () => void;
}

export const useAlert = (): AlertResult => {
  const [alertMessage, setAlertMessageState] = useState<string | null>(null);
  const [isSuccess, setIsSuccessState] = useState<boolean | null>(null);

  const clearAlert = () => {
    setAlertMessageState(null);
    setIsSuccessState(null);
  };

  const setAlertMessage = (message: string, success: boolean) => {
    setAlertMessageState(message);
    setIsSuccessState(success);
    setTimeout(clearAlert, 3000); // Clear after 3 seconds
  };

  return { alertMessage, isSuccess, setAlertMessage, clearAlert };
};
