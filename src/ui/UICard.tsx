import React from "react";
import { TouchableOpacity, View, ViewProps } from "react-native";
import { Presets } from "react-native-pulsar";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

type CardProps = ViewProps & {
  children: React.ReactNode;
  onPress?: () => void;
} & UnistylesVariants<typeof styles>;

export const UICard = ({
  variant,
  children,
  onPress,
  style,
  ...props
}: CardProps) => {
  styles.useVariants({ variant: variant || "elevated" });

  const Component = onPress ? TouchableOpacity : View;

  const handlePress = () => {
    if (onPress) {
      Presets.System.selection();
      onPress();
    }
  };

  return (
    <Component
      style={[styles.card, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    overflow: "hidden",
    variants: {
      variant: {
        elevated: {
          backgroundColor: theme.colors.surfaceElevated,
          ...theme.shadows.md,
        },
        outlined: {
          backgroundColor: theme.colors.surface,
          borderWidth: theme.s(1.5),
          borderColor: theme.colors.border,
        },
        filled: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        ghost: {
          backgroundColor: "transparent",
        },
      },
    },
  },
}));
