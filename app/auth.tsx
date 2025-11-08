import { UIText } from "@/ui";
import { GoogleButton } from "@/ui/components/GoogleButton";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  return (
    <SafeAreaView>
      <View>
        <UIText style={{ color: "white" }}>Auth</UIText>
        <GoogleButton />
      </View>
    </SafeAreaView>
  );
}
