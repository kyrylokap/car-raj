import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";
import { UIText } from "./UIText";

type InputProps = TextInputProps & {
  label?: string;
  containerStyle?: object;
} & UnistylesVariants<typeof styles>;

export const UIInput: React.FC<InputProps> = ({
  label,
  containerStyle,
  style,
  ...props
}) => {
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <UIText style={styles.label}>{label}</UIText>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: "600",
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    variants: {
      hasError: {
        true: {
          borderColor: theme.colors.error,
        },
        false: {
          borderColor: theme.colors.border,
        },
      },
    },
  },
}));
