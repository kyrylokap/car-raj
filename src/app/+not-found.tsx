import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIContainer, UIText } from "../ui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.safeArea}>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
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
