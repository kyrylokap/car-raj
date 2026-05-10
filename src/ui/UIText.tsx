import React from "react";
import { TextProps as RNTextProps, Text } from "react-native";
import { StyleSheet, UnistylesRuntime, UnistylesVariants } from "react-native-unistyles";

type UITextProps = RNTextProps & UnistylesVariants<typeof styles>;

export const UIText = ({
  size,
  color = "text",
  weight,
  style,
  children,
  ...props
}: UITextProps) => {
  styles.useVariants({
    size,
    color,
    weight,
  });

  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create((theme) => ({
  text: {
    includeFontPadding: false,
    letterSpacing: 0.1,
    variants: {
      size: {
        xxs: {
          fontSize: theme.s(10),
          lineHeight: theme.vs(14),
        },
        xs: {
          fontSize: theme.s(12),
          lineHeight: theme.vs(16),
        },
        sm: {
          fontSize: theme.s(14),
          lineHeight: theme.vs(20),
        },
        md: {
          fontSize: theme.s(16),
          lineHeight: theme.vs(24),
        },
        default: {
          fontSize: theme.s(16),
          lineHeight: theme.vs(24),
        },
        lg: {
          fontSize: theme.s(20),
          lineHeight: theme.vs(28),
        },
        xl: {
          fontSize: theme.s(24),
          lineHeight: theme.vs(32),
        },
        xxl: {
          fontSize: theme.s(32),
          lineHeight: theme.vs(40),
        },
      },
      color: {
        primary: {
          color: theme.colors.primary,
        },
        secondary: {
          color: theme.colors.secondary,
        },
        success: {
          color: theme.colors.success,
        },
        warning: {
          color: theme.colors.warning,
        },
        error: {
          color: theme.colors.error,
        },
        text: {
          color: theme.colors.text,
        },
        textSecondary: {
          color: theme.colors.textSecondary,
        },
        textTertiary: {
          color: theme.colors.textTertiary,
        },
        textInverse: {
          color: theme.colors.textInverse,
        },
        white: {
          color: theme.colors.white,
        },
      },
      weight: {
        normal: {
          fontWeight: "400",
        },
        medium: {
          fontWeight: "500",
        },
        semibold: {
          fontWeight: "600",
        },
        bold: {
          fontWeight: "700",
        },
        extrabold: {
          fontWeight: "800",
        },
      },
    },
  },
}));
