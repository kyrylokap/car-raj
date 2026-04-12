import { Ionicons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
  bottomSheet?: boolean;
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
  bottomSheet = false,
}: UIAutocompleteInputProps) => {
  const { theme } = useUnistyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const hasError = !!errorMessage;
  const inputRef = useRef<any>(null);

  const InputComponent = bottomSheet ? BottomSheetTextInput : TextInput;

  const { data: suggestionsData = [] } = useCarSuggestionsFormatted(
    type || "brand",
    searchQuery,
    brandFilter,
  );

  const options = useMemo(() => {
    return type
      ? suggestionsData
      : initialOptions?.map((opt) => ({ id: opt, title: opt })) || [];
  }, [type, suggestionsData, initialOptions]);

  const selectedLabel = useMemo((): string => {
    if (!value) return "";
    const found = options.find((item: any) => item.id === value);
    return found ? String(found.title) : value;
  }, [options, value]);

  const handleSelect = (item: any) => {
    onChangeText(item.id);
    setSearchQuery("");
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSearchQuery("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <UIText style={[styles.label, hasError && styles.labelError]}>
          {label}
        </UIText>
      )}

      {!isOpen ? (
        <TouchableOpacity
          style={[styles.selector, hasError && styles.selectorError]}
          onPress={handleOpen}
          activeOpacity={0.7}
        >
          <UIText
            style={value ? styles.selectedText : styles.placeholderText}
            numberOfLines={1}
          >
            {value ? selectedLabel : placeholder || "Select item"}
          </UIText>
          <Ionicons
            name="chevron-down"
            size={20}
            color={hasError ? theme.colors.error : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      ) : (
        <View>
          <View style={[styles.selector, styles.selectorFocused]}>
            <InputComponent
              ref={inputRef}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Type to search..."
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus
            />
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {options.length > 0 && (
            <View style={styles.dropdownList}>
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {options.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.option,
                      item.id === value && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.6}
                  >
                    <UIText
                      style={[
                        styles.optionText,
                        item.id === value && styles.optionTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </UIText>
                    {item.id === value && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {options.length === 0 && searchQuery.length > 0 && (
            <View style={styles.emptyState}>
              <UIText style={styles.emptyText}>No results found</UIText>
            </View>
          )}
        </View>
      )}

      {errorMessage && (
        <UIText
          style={styles.errorText}
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
  labelError: {
    color: theme.colors.error,
  },
  selector: {
    height: theme.s(52),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderLight,
    borderWidth: theme.s(1.5),
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorError: {
    borderColor: theme.colors.error,
    backgroundColor: `${theme.colors.error}08`,
  },
  selectorFocused: {
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  dropdownList: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.md,
  },
  scrollView: {
    maxHeight: 250,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderLight,
  },
  optionSelected: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.md,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.s(4),
    marginLeft: theme.s(4),
  },
}));
