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
} & UnistylesVariants<typeof styles>;

export const UIButton: React.FC<ButtonProps> = ({
  variant,
  size,
  loading = false,
  children,
  disabled,
  style,
  ...props
}) => {
  styles.useVariants({
    variant: variant || "primary",
    size: size || "medium",
  });

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

const styles = StyleSheet.create((theme) => ({
  button: {
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        secondary: {
          backgroundColor: theme.colors.secondary,
          shadowColor: theme.colors.secondary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        success: {
          backgroundColor: theme.colors.success,
          shadowColor: theme.colors.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        error: {
          backgroundColor: theme.colors.error,
          shadowColor: theme.colors.error,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        outline: {
          backgroundColor: "transparent",
          borderWidth: theme.s(1.5),
          borderColor: theme.colors.primary,
        },
        ghost: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        link: {
          backgroundColor: "transparent",
        },
      },
      size: {
        small: {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          minHeight: theme.vs(40),
          borderRadius: theme.borderRadius.md,
        },
        medium: {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          minHeight: theme.vs(48),
        },
        large: {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
          minHeight: theme.vs(56),
          borderRadius: theme.borderRadius.xl,
        },
      },
    },
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
}));
