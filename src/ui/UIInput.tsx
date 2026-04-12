import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleProp, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";
import { UIText } from "./UIText";

type InputProps = TextInputProps & {
  label?: string;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & UnistylesVariants<typeof styles>;

export const UIInput = ({
  label,
  errorMessage,
  containerStyle,
  style,
  hasError: variantHasError,
  focused: variantFocused,
  ...props
}: InputProps) => {
  const hasError = !!errorMessage || variantHasError;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <UIText style={[styles.label, hasError && styles.labelError] as StyleProp<TextStyle>}>
          {label}
        </UIText>
      )}
      <BottomSheetTextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          variantFocused && styles.inputFocused,
          style,
        ] as StyleProp<TextStyle>}
        placeholderTextColor={styles.placeholder.color}
        {...props}
      />
      {errorMessage && (
        <UIText
          style={styles.errorText as StyleProp<TextStyle>}
          size="xs"
          weight="medium"
          color="error"
        >
          {errorMessage}
        </UIText>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  placeholder: {
    color: theme.colors.textSecondary,
  },
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  input: {
    textAlignVertical: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: theme.s(1.5),
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.s(16),
    color: theme.colors.text,
    variants: {
      hasError: {
        true: {
          borderColor: theme.colors.error,
          backgroundColor: `${theme.colors.error}08`,
        },
        false: {
          borderColor: theme.colors.borderLight,
        },
      },
      focused: {
        true: {
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        false: {
          borderColor: theme.colors.borderLight,
        },
      },
    },
  },
  labelError: {
    color: theme.colors.error,
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: `${theme.colors.error}08`,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.s(4),
    marginLeft: theme.s(4),
  },
  helperText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
}));

