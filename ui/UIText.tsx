import React from "react";
import { TextProps as RNTextProps, Text } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

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
    variants: {
      size: {
        xxs: {
          fontSize: 10,
          lineHeight: 14,
        },
        xs: {
          fontSize: 12,
          lineHeight: 16,
        },
        sm: {
          fontSize: 14,
          lineHeight: 20,
        },
        md: {
          fontSize: 16,
          lineHeight: 24,
        },
        default: {
          fontSize: 16,
          lineHeight: 24,
        },
        lg: {
          fontSize: 20,
          lineHeight: 28,
        },
        xl: {
          fontSize: 24,
          lineHeight: 32,
        },
        xxl: {
          fontSize: 32,
          lineHeight: 40,
        },
      },
      color: {
        primary: {
          color: theme.colors.primary,
        },
        secondary: {
          color: theme.colors.secondary,
        },
        text: {
          color: theme.colors.text,
        },
        textSecondary: {
          color: theme.colors.textSecondary,
        },
        error: {
          color: theme.colors.error,
        },
        success: {
          color: theme.colors.success,
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
      },
    },
  },
}));
