import React from "react";
import { View, ViewProps } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

type ContainerProps = ViewProps & {
  children: React.ReactNode;
} & UnistylesVariants<typeof stylesheet>;

export const UIContainer: React.FC<ContainerProps> = ({
  padding,
  children,
  style,
  ...props
}) => {
  stylesheet.useVariants({ padding: padding || "md" });
  const styles = stylesheet;

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const stylesheet = StyleSheet.create((theme) => ({
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
