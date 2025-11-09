import { supabase } from "@/api/supabase";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native-unistyles";
import { UIButton } from "../UIButton";
import { UIText } from "../UIText";
export const GoogleButton = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CAR_RAJ_WEB_ID,
      scopes: ["profile", "email", "phone"],
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) throw new Error("No ID token");

      await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data?.idToken,
      });
      router.replace("/");
    } catch (err) {
      console.log("Google error:", err);
    }
  };

  return (
    <UIButton variant="ghost" style={styles.button} onPress={handleGoogleLogin}>
      <Ionicons name="logo-google" color="white" size={24} />
      <UIText size="lg">Continue with Google</UIText>
    </UIButton>
  );
};

const styles = StyleSheet.create({
  button: {
    gap: 10,
  },
});
