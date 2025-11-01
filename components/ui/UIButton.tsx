import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

type ButtonProps = TouchableOpacityProps & {
  loading?: boolean;
  children: React.ReactNode;
} & UnistylesVariants<typeof stylesheet>;

export const UIButton: React.FC<ButtonProps> = ({
  variant,
  size,
  loading = false,
  children,
  disabled,
  style,
  ...props
}) => {
  stylesheet.useVariants({
    variant: variant || "primary",
    size: size || "medium",
  });
  const styles = stylesheet;

  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.disabled, style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : undefined}
        />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const stylesheet = StyleSheet.create((theme) => ({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
        },
        outline: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        ghost: {
          backgroundColor: "transparent",
        },
      },
      size: {
        small: {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          minHeight: 36,
        },
        medium: {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          minHeight: 48,
        },
        large: {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
          minHeight: 56,
        },
      },
    },
  },
  disabled: {
    opacity: 0.5,
  },
}));
