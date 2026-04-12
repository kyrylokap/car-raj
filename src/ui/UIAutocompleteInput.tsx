import { Ionicons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Presets } from "react-native-pulsar";
import { StyleSheet } from "react-native-unistyles";
import { useCarSuggestionsFormatted } from "../api/car";
import { UIText } from "./UIText";

interface UIAutocompleteInputProps {
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: "brand" | "model" | "location" | "color";
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
    Presets.System.selection();
    onChangeText(item.id);
    setSearchQuery("");
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const handleOpen = () => {
    if (!isOpen) {
      Presets.System.selection();
      setIsOpen(true);
      setSearchQuery("");
      inputRef.current?.focus();
    }
  };

  const handleClose = () => {
    Presets.System.selection();
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

      <View
        style={[
          styles.selector,
          isOpen ? styles.selectorFocused : hasError && styles.selectorError,
        ]}
      >
        <InputComponent
          ref={inputRef}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={isOpen ? "Type to search..." : ""}
          placeholderTextColor={styles.placeholderText.color}
          onFocus={handleOpen}
        />

        {!isOpen && (
          <View
            style={styles.selectedOverlay}
            pointerEvents="none"
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
              color={hasError ? styles.errorIcon.color : styles.placeholderText.color}
            />
          </View>
        )}

        {isOpen && (
          <TouchableOpacity onPress={handleClose} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={20}
              color={styles.placeholderText.color}
            />
          </TouchableOpacity>
        )}
      </View>

      {isOpen && (
        <>
          {options.length > 0 && (
            <View style={styles.dropdownList}>
              <FlashList
                data={options}
                keyExtractor={(item: any) => item.id}
                keyboardShouldPersistTaps="handled"
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }: { item: any }) => (
                  <TouchableOpacity
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
                        color={styles.primaryIcon.color}
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {options.length === 0 && searchQuery.length > 0 && (
            <View style={styles.emptyState}>
              <UIText style={styles.emptyText}>No results found</UIText>
            </View>
          )}
        </>
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
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  primaryIcon: {
    color: theme.colors.primary,
  },
  errorIcon: {
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
    marginTop: theme.spacing.sm,
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
    marginTop: theme.spacing.sm,
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
