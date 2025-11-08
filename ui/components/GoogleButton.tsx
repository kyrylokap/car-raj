import { supabase } from "@/api/supabase";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { UIText } from "../UIText";
export const GoogleButton = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CAR_RAJ_WEB_ID,
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
    } catch (err) {
      console.log("Google error:", err);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "black",
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
      }}
      onPress={handleGoogleLogin}
    >
      <Ionicons name="logo-google" color="white" size={24} />
      <UIText style={{ color: "white", fontWeight: "600" }}>
        Sign in with Google
      </UIText>
    </TouchableOpacity>
  );
};
