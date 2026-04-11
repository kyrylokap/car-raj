import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native-unistyles";
import { useCarSuggestionsFormatted } from "../api/car";
import { UIText } from "./UIText";

interface UIAutocompleteInputProps {
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: "brand" | "model" | "location";
  brandFilter?: string;
  containerStyle?: StyleProp<ViewStyle>;
  initialOptions?: string[];
}

export const UIAutocompleteInput = ({
  label,
  errorMessage,
  placeholder,
  value,
  onChangeText,
  type,
  brandFilter,
  containerStyle,
  initialOptions,
}: UIAutocompleteInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const hasError = !!errorMessage;

  const { data: suggestionsData = [], isLoading } = useCarSuggestionsFormatted(
    type || "brand",
    searchQuery,
    brandFilter,
  );

  const remoteData = type
    ? suggestionsData
    : initialOptions?.map((opt) => ({ id: opt, title: opt })) || [];

  const suggestions = React.useMemo(() => {
    const list = remoteData || [];
    if (value && !list.find((item: any) => item.id === value)) {
      list.unshift({ id: value, title: value });
    }
    return list;
  }, [remoteData, value]);

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <UIText style={styles.textItem as StyleProp<TextStyle>}>
          {item.title}
        </UIText>
        {item.id === value && (
          <Ionicons
            color={styles.primaryColor.color}
            name="checkmark"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <UIText style={[styles.label, hasError && styles.labelError]}>
          {label}
        </UIText>
      )}
      <Dropdown
        style={
          [
            styles.dropdown,
            isFocus && { borderColor: styles.primaryColor.color },
            hasError && styles.dropdownError,
          ] as StyleProp<ViewStyle>
        }
        placeholderStyle={styles.placeholderStyle as StyleProp<TextStyle>}
        selectedTextStyle={
          [
            styles.selectedTextStyle,
            isFocus && { color: styles.textSecondaryColor.color, opacity: 0.3 },
          ] as StyleProp<TextStyle>
        }
        inputSearchStyle={styles.inputSearchStyle as StyleProp<TextStyle>}
        iconStyle={styles.iconStyle}
        data={suggestions}
        search
        maxHeight={250}
        labelField="title"
        valueField="id"
        placeholder={!isFocus ? placeholder || "Select item" : ""}
        searchPlaceholder="Type to search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChangeText(item.id);
          setIsFocus(false);
          setSearchQuery("");
        }}
        onChangeText={(text) => setSearchQuery(text)}
        renderItem={renderItem}
        containerStyle={styles.dropdownContainer as StyleProp<ViewStyle>}
        dropdownPosition="bottom"
        activeColor={styles.surfaceColor.backgroundColor}
        flatListProps={{
          keyboardShouldPersistTaps: "handled",
          nestedScrollEnabled: true,
        }}
        renderRightIcon={() => (
          <Ionicons
            name="chevron-down"
            size={20}
            color={
              hasError
                ? styles.errorColor.color
                : styles.textSecondaryColor.color
            }
          />
        )}
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
  surfaceColor: {
    backgroundColor: theme.colors.surface,
  },
  errorColor: {
    color: theme.colors.error,
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
  textSecondaryColor: {
    color: theme.colors.textSecondary,
  },
  primaryColor: {
    color: theme.colors.primary,
  },
  dropdown: {
    height: theme.s(52),
    borderColor: theme.colors.borderLight,
    borderWidth: theme.s(1.5),
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 0,
    marginTop: theme.s(6),
    overflow: "hidden",
    ...theme.shadows.xl,
  },
  item: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderLight,
  },
  textItem: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  placeholderStyle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  selectedTextStyle: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  iconStyle: {
    width: theme.s(20),
    height: theme.s(20),
  },
  inputSearchStyle: {
    ...theme.typography.body,
    color: theme.colors.text,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.sm,
  },
  labelError: {
    color: theme.colors.error,
  },
  dropdownError: {
    borderColor: theme.colors.error,
    backgroundColor: `${theme.colors.error}08`,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.s(4),
    marginLeft: theme.s(4),
  },
}));
