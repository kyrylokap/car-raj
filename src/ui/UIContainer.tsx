import React from "react";
import { View, ViewProps } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

type ContainerProps = ViewProps & {
  children: React.ReactNode;
} & UnistylesVariants<typeof styles>;

export const UIContainer: React.FC<ContainerProps> = ({
  padding,
  children,
  style,
  ...props
}) => {
  styles.useVariants({ padding: padding || "md" });

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    variants: {
      padding: {
        none: {
          padding: 0,
        },
        sm: {
          padding: theme.spacing.sm,
        },
        md: {
          padding: theme.spacing.md,
        },
        lg: {
          padding: theme.spacing.lg,
        },
        xl: {
          padding: theme.spacing.xl,
        },
      },
    },
  },
}));
