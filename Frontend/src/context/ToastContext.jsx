import { createContext, useCallback, useState } from "react";
import Toast from "../components/Toast/Toast";
import { TOAST_TYPES } from "../utils/constants";

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO, duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const toast = {
    success: (msg) => showToast(msg, TOAST_TYPES.SUCCESS),
    error: (msg) => showToast(msg, TOAST_TYPES.ERROR),
    info: (msg) => showToast(msg, TOAST_TYPES.INFO),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end px-4 sm:px-0">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
