import { createContext, useCallback, useState } from "react";
import { TOAST_TYPES } from "../utils/constants";
import { classNames } from "../utils/helpers";

export const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO, duration = 3000) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (msg, duration) => showToast(msg, TOAST_TYPES.SUCCESS, duration),
    error: (msg, duration) => showToast(msg, TOAST_TYPES.ERROR, duration),
    info: (msg, duration) => showToast(msg, TOAST_TYPES.INFO, duration),
    warning: (msg, duration) => showToast(msg, TOAST_TYPES.WARNING, duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={classNames(
              "pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-lg border text-sm shadow-2xl transition-all duration-200 animate-slide-down bg-surface",
              t.type === TOAST_TYPES.SUCCESS && "border-success/40 text-success-hover bg-surface",
              t.type === TOAST_TYPES.ERROR && "border-danger/60 text-danger bg-surface",
              t.type === TOAST_TYPES.WARNING && "border-warning/60 text-warning bg-surface",
              t.type === TOAST_TYPES.INFO && "border-accent/60 text-accent bg-surface"
            )}
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <span className="shrink-0 font-semibold mt-0.5">
                {t.type === TOAST_TYPES.SUCCESS && "✓"}
                {t.type === TOAST_TYPES.ERROR && "✕"}
                {t.type === TOAST_TYPES.WARNING && "⚠"}
                {t.type === TOAST_TYPES.INFO && "ℹ"}
              </span>
              <p className="text-slate-100 text-xs sm:text-sm leading-snug break-words">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-200 text-xs shrink-0 px-1 py-0.5"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
