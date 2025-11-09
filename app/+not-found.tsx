import { UIContainer, UIText } from "@/ui";
import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function NotFoundScreen() {
  const { theme } = useUnistyles();
  const styles = stylesheet;

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <UIContainer style={styles.container}>
          <UIText size="xl" style={styles.title}>
            This screen doesn't exist.
          </UIText>
          <Link href="/" style={styles.link}>
            <UIText color="primary" style={styles.linkText}>
              Go to home screen!
            </UIText>
          </Link>
        </UIContainer>
      </SafeAreaView>
    </>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  link: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  linkText: {
    textAlign: "center",
  },
}));
