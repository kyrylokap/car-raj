import { UIContainer, UIText } from "@/components/ui";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function ModalScreen() {
  const { theme } = useUnistyles();
  const styles = stylesheet;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <UIContainer>
        <UIText size="xl" style={styles.title}>
          Modal
        </UIText>
        <UIText size="default" color="textSecondary" style={styles.subtitle}>
          This is a modal screen
        </UIText>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </UIContainer>
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
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
