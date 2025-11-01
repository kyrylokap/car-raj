import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { UnistylesRuntime } from "react-native-unistyles";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@auto_raj_theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const themeMode = (UnistylesRuntime.themeName || "light") as ThemeMode;
  const isDarkMode = themeMode === "dark";

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
          UnistylesRuntime.setTheme(savedTheme as ThemeMode);
        } else {
          UnistylesRuntime.setTheme("light");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        UnistylesRuntime.setTheme("light");
      } finally {
        setIsLoading(false);
        setUpdateTrigger((prev) => prev + 1);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    UnistylesRuntime.setTheme(newMode);
    setUpdateTrigger((prev) => prev + 1);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    UnistylesRuntime.setTheme(mode);
    setUpdateTrigger((prev) => prev + 1);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ themeMode, isDarkMode, toggleTheme, setThemeMode, isLoading }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
