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
          fontSize: theme.scale(10),
          lineHeight: theme.verticalScale(14),
        },
        xs: {
          fontSize: theme.scale(12),
          lineHeight: theme.verticalScale(16),
        },
        sm: {
          fontSize: theme.scale(14),
          lineHeight: theme.verticalScale(20),
        },
        md: {
          fontSize: theme.scale(16),
          lineHeight: theme.verticalScale(24),
        },
        default: {
          fontSize: theme.scale(16),
          lineHeight: theme.verticalScale(24),
        },
        lg: {
          fontSize: theme.scale(20),
          lineHeight: theme.verticalScale(28),
        },
        xl: {
          fontSize: theme.scale(24),
          lineHeight: theme.verticalScale(32),
        },
        xxl: {
          fontSize: theme.scale(32),
          lineHeight: theme.verticalScale(40),
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
