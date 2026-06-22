import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDark, setIsDark] = useState(deviceTheme === "dark");
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Load theme preference from storage on initial render
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemePreference = await AsyncStorage.getItem("themePreference");
        const savedIsSystemTheme = await AsyncStorage.getItem("isSystemTheme");
        
        if (savedIsSystemTheme !== null) {
          const parsedIsSystemTheme = JSON.parse(savedIsSystemTheme);
          setIsSystemTheme(parsedIsSystemTheme);
          
          if (parsedIsSystemTheme) {
            // Use system theme
            setIsDark(deviceTheme === "dark");
          } else if (savedThemePreference !== null) {
            // Use saved theme preference
            setIsDark(savedThemePreference === "dark");
          }
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();
  }, [deviceTheme]);

  // Update theme when device theme changes if using system theme
  useEffect(() => {
    if (isSystemTheme) {
      setIsDark(deviceTheme === "dark");
    }
  }, [deviceTheme, isSystemTheme]);

  // Toggle theme
  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      setIsSystemTheme(false);
      await AsyncStorage.setItem("themePreference", newIsDark ? "dark" : "light");
      await AsyncStorage.setItem("isSystemTheme", JSON.stringify(false));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Use system theme
  const useSystemTheme = async () => {
    try {
      setIsSystemTheme(true);
      setIsDark(deviceTheme === "dark");
      await AsyncStorage.setItem("isSystemTheme", JSON.stringify(true));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const value = {
    isDark,
    isSystemTheme,
    toggleTheme,
    useSystemTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};