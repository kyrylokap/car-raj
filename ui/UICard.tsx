import React from "react";
import { TouchableOpacity, View, ViewProps } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

type CardProps = ViewProps & {
  children: React.ReactNode;
  onPress?: () => void;
} & UnistylesVariants<typeof styles>;

export const UICard: React.FC<CardProps> = ({
  variant,
  children,
  onPress,
  style,
  ...props
}) => {
  styles.useVariants({ variant: variant || "elevated" });

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    variants: {
      variant: {
        elevated: {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        },
        outlined: {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
      },
    },
  },
}));
