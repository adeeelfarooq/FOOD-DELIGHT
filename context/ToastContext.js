import { MotiText, MotiView } from "moti";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (toast) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Auto hide after duration
      timeoutRef.current = setTimeout(() => {
        setToast(null);
      }, toast.duration || 3000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toast]);

  const showToast = ({
    title,
    description,
    type = "default", // default, success, error, warning
    duration = 3000,
  }) => {
    setToast({ title, description, type, duration });
  };

  const hideToast = () => {
    setToast(null);
  };

  const getToastBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "#22c55e"; // green-500
      case "error":
        return "#ef4444"; // red-500
      case "warning":
        return "#f59e0b"; // amber-500
      default:
        return "#374151"; // gray-700
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <MotiView
          from={{ opacity: 0, translateY: 50, scale: 0.9 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 18 }}
          style={[
            styles.toastContainer,
            { backgroundColor: getToastBackgroundColor(toast.type) },
          ]}
        >
          {toast.title && <MotiText style={styles.toastTitle}>{toast.title}</MotiText>}
          {toast.description && (
            <MotiText style={styles.toastText}>{toast.description}</MotiText>
          )}
        </MotiView>
      )}
    </ToastContext.Provider>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: width * 0.1,
    right: width * 0.1,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 9999,
    alignItems: "center",
  },
  toastTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  toastText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
});
