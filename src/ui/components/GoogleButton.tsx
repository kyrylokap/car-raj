import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { supabase } from "../../api/supabase";
import { UIButton } from "../UIButton";
import { UIText } from "../UIText";
export const GoogleButton = () => {
  const { theme } = useUnistyles();
  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CAR_RAJ_WEB_ID;
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_CAR_RAJ_IOS_ID;

    GoogleSignin.configure({
      webClientId,
      ...(iosClientId && { iosClientId }),
      scopes: ["profile", "email"],
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data: userInfo } = await GoogleSignin.signIn();
      if (!userInfo?.idToken) throw new Error("No ID token");
      console.log(userInfo);

      const { data: signInResponse } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.idToken,
      });
      console.log(signInResponse.user);

      try {
        const { data: userData, error: userErr } =
          await supabase.auth.getUser();
        if (userErr) console.log(userErr);
        const supaUser = userData?.user;
        if (supaUser) {
          const fullname =
            userInfo?.user?.name ?? supaUser.user_metadata?.full_name ?? null;
          const image_url =
            userInfo?.user?.photo ?? supaUser.user_metadata?.avatar_url ?? null;
          await supabase
            .from("user_details")
            .upsert({ id: supaUser.id, fullname, image_url });
        }
      } catch (err) {
        console.log("Failed to upsert user_details:", err);
      }

      router.replace("/");
    } catch (err) {
      console.log("Google error:", err);
    }
  };

  return (
    <UIButton
      variant="outline"
      size="large"
      style={styles.button}
      onPress={handleGoogleLogin}
    >
      <Ionicons
        name="logo-google"
        color={theme.colors.text}
        size={theme.s(24)}
      />
      <UIText size="md" weight="semibold">
        Continue with Google
      </UIText>
    </UIButton>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    gap: theme.s(10),
    width: "100%",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
  },
}));
