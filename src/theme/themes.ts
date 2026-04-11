import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / BASE_HEIGHT) * size;

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const lightTheme = {
  colors: {
    primary: "#4F46E5", // Indigo 600
    primaryLight: "#6366F1", // Indigo 500
    primaryDark: "#4338CA", // Indigo 700
    secondary: "#9333EA", // Purple 600
    secondaryLight: "#A855F7", // Purple 500
    secondaryDark: "#7E22CE", // Purple 700
    success: "#059669", // Emerald 600
    successLight: "#10B981", // Emerald 500
    successDark: "#047857", // Emerald 700
    warning: "#D97706", // Amber 600
    warningLight: "#F59E0B", // Amber 500
    warningDark: "#B45309", // Amber 700
    error: "#DC2626", // Red 600
    errorLight: "#EF4444", // Red 500
    errorDark: "#B91C1C", // Red 700
    background: "#F8FAFC", // Slate 50
    backgroundSecondary: "#F1F5F9", // Slate 100
    surface: "#FFFFFF",
    surfaceVariant: "#F1F5F9",
    surfaceElevated: "#FFFFFF",
    text: "#0F172A", // Slate 900
    textSecondary: "#475569", // Slate 600
    textTertiary: "#94A3B8", // Slate 400
    textInverse: "#FFFFFF",
    border: "#E2E8F0", // Slate 200
    borderLight: "#F1F5F9", // Slate 100
    borderDark: "#CBD5E1", // Slate 300
    white: "#FFFFFF",
    black: "#0F172A",
    tabBar: "#FFFFFF",
    card: "#FFFFFF",
    overlay: "rgba(15, 23, 42, 0.4)",
    backdrop: "rgba(255, 255, 255, 0.8)",
    shadow: "rgba(15, 23, 42, 0.08)",
    shadowDark: "rgba(15, 23, 42, 0.12)",
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
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
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
  shadows: {
    sm: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  s: scale,
  vs: verticalScale,
} as const;

export const darkTheme = {
  colors: {
    primary: "#6366F1", // Indigo 500
    primaryLight: "#818CF8", // Indigo 400
    primaryDark: "#4F46E5", // Indigo 600
    secondary: "#A855F7", // Purple 500
    secondaryLight: "#C084FC", // Purple 400
    secondaryDark: "#9333EA", // Purple 600
    success: "#10B981", // Emerald 500
    successLight: "#34D399", // Emerald 400
    successDark: "#059669", // Emerald 600
    warning: "#F59E0B", // Amber 500
    warningLight: "#FBBF24", // Amber 400
    warningDark: "#D97706", // Amber 600
    error: "#EF4444", // Red 500
    errorLight: "#F87171", // Red 400
    errorDark: "#DC2626", // Red 600
    background: "#020617", // Slate 950
    backgroundSecondary: "#0F172A", // Slate 900
    surface: "#1E293B", // Slate 800
    surfaceVariant: "#334155", // Slate 700
    surfaceElevated: "#0F172A", // Slate 900
    text: "#F8FAFC", // Slate 50
    textSecondary: "#94A3B8", // Slate 400
    textTertiary: "#64748B", // Slate 500
    textInverse: "#020617",
    border: "#1E293B", // Slate 800
    borderLight: "#334155", // Slate 700
    borderDark: "#0F172A", // Slate 900
    white: "#F8FAFC",
    black: "#020617",
    tabBar: "#0F172A",
    card: "#1E293B",
    overlay: "rgba(0, 0, 0, 0.8)",
    backdrop: "rgba(2, 6, 23, 0.85)",
    shadow: "rgba(0, 0, 0, 0.5)",
    shadowDark: "rgba(0, 0, 0, 0.7)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "800" as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: "700" as const,
      lineHeight: 34,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 22,
      fontWeight: "600" as const,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: "600" as const,
      lineHeight: 24,
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
    tiny: {
      fontSize: 11,
      fontWeight: "400" as const,
      lineHeight: 14,
    },
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  s: scale,
  vs: verticalScale,
} as const;
