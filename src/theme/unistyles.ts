import { StyleSheet } from "react-native-unistyles";
import { useThemeStore } from "../store/themeStore";
import { darkTheme, lightTheme } from "./themes";

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  settings: {
    initialTheme: () => {
      return useThemeStore.getState().theme;
    },
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
});
