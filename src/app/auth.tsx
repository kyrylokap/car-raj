import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { UICard, UIText } from "../ui";
import { GoogleButton } from "../ui/components/GoogleButton";

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <UICard style={styles.form}>
        <UIText size="xxl" weight="bold" style={styles.topText}>
          Sign in
        </UIText>

        <GoogleButton />
      </UICard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  googleAuthButtonContainer: { gap: 20 },
  topText: {
    textAlign: "center",
    paddingVertical: 8,
  },
  form: {
    width: "80%",
    borderRadius: 20,
    gap: 10,
    padding: 30,
  },
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));
