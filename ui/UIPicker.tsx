import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UIText } from "./UIText";

type UIPickerProps = {
  label: string;
  values: string[];
  currentPickerValue: string;
  pick: (value: string) => void;
};

export const UIPicker = ({
  label,
  values,
  currentPickerValue,
  pick,
}: UIPickerProps) => {
  const [isVisiblePicker, setIsVisiblePicker] = useState<boolean>(false);
  const { theme } = useUnistyles();
  return (
    <View style={[styles.container]}>
      <UIText style={styles.label}>{label}</UIText>
      <Pressable
        style={styles.picker}
        onPress={() => setIsVisiblePicker((prev) => !prev)}
      >
        <UIText>{currentPickerValue}</UIText>
        <Ionicons
          name={`chevron-${isVisiblePicker ? "up" : "down"}`}
          color={theme.colors.primary}
          size={24}
        />
      </Pressable>
      {isVisiblePicker ? (
        <View style={styles.itemsContainer}>
          {values.map((item) => {
            return (
              <Pressable
                style={styles.pickerItem({
                  isSelected: item === currentPickerValue,
                })}
                key={item}
                onPress={() => {
                  pick(item);
                  setIsVisiblePicker(false);
                }}
              >
                <UIText>{item}</UIText>
              </Pressable>
            );
          })}
        </View>
      ) : null}
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
  picker: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerItem: ({ isSelected }: { isSelected?: boolean }) => ({
    ...theme.typography.body,
    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
    padding: theme.spacing.sm,
    color: theme.colors.text,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }),
  itemsContainer: {
    position: "absolute",
    zIndex: 10,
    top: 30,
    width: 200,
    shadowColor: theme.colors.white,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
}));
