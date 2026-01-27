import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native-unistyles";
import { darkTheme, lightTheme } from "./themes";

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

const initializeUnistyles = async () => {
  const persistedTheme =
    ((await AsyncStorage.getItem("@auto_raj_theme_mode")) as
      | "light"
      | "dark") || "light";
  StyleSheet.configure({
    settings: {
      initialTheme: persistedTheme || "light",
    },
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  });
};

initializeUnistyles();
