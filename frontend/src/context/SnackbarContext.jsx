import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
  const [snack, setSnack] = useState(null);
  const [timerId, setTimerId] = useState(null);

  const hideSnackbar = useCallback(() => {
    setSnack(null);
  }, []);

  const showSnackbar = useCallback(
    (message, type = "info", duration = 4000) => {
      if (!message) return;

      if (timerId) {
        clearTimeout(timerId);
      }

      setSnack({ message, type });

      const newTimer = setTimeout(() => {
        setSnack(null);
      }, duration);

      setTimerId(newTimer);
    },
    [timerId]
  );

  const showSuccess = useCallback(
    (msg, duration) => showSnackbar(msg, "success", duration),
    [showSnackbar]
  );

  const showError = useCallback(
    (msg, duration) => showSnackbar(msg, "error", duration),
    [showSnackbar]
  );

  const showWarning = useCallback(
    (msg, duration) => showSnackbar(msg, "warning", duration),
    [showSnackbar]
  );

  const showInfo = useCallback(
    (msg, duration) => showSnackbar(msg, "info", duration),
    [showSnackbar]
  );

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircleIcon,
          border: "border-success/30",
          bg: "bg-surface",
          iconColor: "text-success",
          badgeBg: "bg-success-light",
        };
      case "error":
        return {
          icon: ExclamationCircleIcon,
          border: "border-danger/30",
          bg: "bg-surface",
          iconColor: "text-danger",
          badgeBg: "bg-danger-light",
        };
      case "warning":
        return {
          icon: ExclamationTriangleIcon,
          border: "border-warning/30",
          bg: "bg-surface",
          iconColor: "text-warning",
          badgeBg: "bg-warning-light",
        };
      default:
        return {
          icon: InformationCircleIcon,
          border: "border-primary/30",
          bg: "bg-surface",
          iconColor: "text-primary",
          badgeBg: "bg-primary-light",
        };
    }
  };

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideSnackbar,
      }}
    >
      {children}

      {/* Global Snackbar UI Container */}
      {snack && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm sm:max-w-md animate-card-enter">
          {(() => {
            const styles = getStyles(snack.type);
            const Icon = styles.icon;

            return (
              <div
                className={`flex items-center gap-3 rounded-2xl border ${styles.border} ${styles.bg} p-4 shadow-xl text-text-primary backdrop-blur-md`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.badgeBg} ${styles.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-semibold leading-relaxed break-words">
                    {snack.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={hideSnackbar}
                  className="rounded-lg p-1 text-text-muted transition hover:bg-surface-muted hover:text-text-primary cursor-pointer shrink-0"
                  title="Dismiss notification"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

