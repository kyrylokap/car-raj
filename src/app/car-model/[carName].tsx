import { useCar3dModel } from "@/src/hooks/useCar3dModel";
import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { WebView } from "react-native-webview";

export default function CarModelPage() {
  const { carName } = useLocalSearchParams<{ carName: string }>();
  const { data: carModel, isLoading } = useCar3dModel(carName as string);
  const router = useRouter();

  const backButton = (
    <Pressable style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.root}>
        <View style={styles.loading}>
          <UIText>Loading 3D model...</UIText>
        </View>
        {backButton}
      </View>
    );
  }

  if (!carModel?.embedUrl) {
    return (
      <View style={styles.root}>
        <View style={styles.loading}>
          <UIText>No 3D model found for "{carName}"</UIText>
        </View>
        {backButton}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <WebView
        source={{ uri: carModel.embedUrl }}
        allowsInlineMediaPlayback
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
      {backButton}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  backButton: {
    position: "absolute",
    top: rt.insets.top + theme.spacing.md,
    left: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
}));
