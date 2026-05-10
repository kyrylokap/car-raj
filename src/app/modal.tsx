import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIContainer, UIText } from "../ui";

export default function ModalScreen() {
  return (
    <View style={styles.safeArea}>
      <UIContainer>
        <UIText size="xl" style={styles.title}>
          Modal
        </UIText>
        <UIText color="textSecondary" style={styles.subtitle}>
          This is a modal screen
        </UIText>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </UIContainer>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
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
