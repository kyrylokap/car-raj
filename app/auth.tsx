import { UIButton, UICard, UIInput, UIText } from "@/ui";
import { GoogleButton } from "@/ui/components/GoogleButton";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <UICard style={styles.form}>
        <UIText size="xxl" weight="bold" style={styles.topText}>
          Sign in
        </UIText>
        <UIInput label="Email" />
        <UIInput label="Password" />
        <View style={styles.googleAuthButtonContainer}>
          <UIButton variant="secondary">
            <UIText size="lg">Sign in</UIText>
          </UIButton>

          <GoogleButton />
        </View>
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
