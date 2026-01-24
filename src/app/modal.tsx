import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { UIContainer, UIText } from "../ui";

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <UIContainer>
        <UIText size="xl" style={styles.title}>
          Modal
        </UIText>
        <UIText color="textSecondary" style={styles.subtitle}>
          This is a modal screen
        </UIText>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </UIContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
}));
