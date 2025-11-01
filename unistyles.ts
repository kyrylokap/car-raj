import { StyleSheet } from "react-native-unistyles";

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const lightTheme = {
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30",
    background: "#FFFFFF",
    surface: "#F2F2F7",
    surfaceVariant: "#FFFFFF",
    text: "#000000",
    textSecondary: "#8E8E93",
    border: "#E5E5EA",
    borderLight: "#F2F2F7",
    white: "#FFFFFF",
    black: "#000000",
    tabBar: "#F9F9F9",
    card: "#FFFFFF",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "700" as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "700" as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600" as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 16,
    },
  },
} as const;

export const darkTheme = {
  colors: {
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    background: "#000000",
    surface: "#1C1C1E",
    surfaceVariant: "#2C2C2E",
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    border: "#38383A",
    borderLight: "#2C2C2E",
    white: "#FFFFFF",
    black: "#000000",
    tabBar: "#1C1C1E",
    card: "#1C1C1E",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "700" as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "700" as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600" as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 16,
    },
  },
} as const;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Configure Unistyles with themes
const unistylesConfig = StyleSheet.configure({
  settings: {
    adaptiveThemes: false,
    initialTheme: "light",
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
});
