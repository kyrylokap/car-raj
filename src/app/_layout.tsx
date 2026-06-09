import "@/src/theme/unistyles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Presets } from "react-native-pulsar";
import { useUser } from "../api/auth";
import { useNotifications } from "../api/useNotifications";
import { OnlineUsersProvider } from "../contexts/OnlineUsersContext";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const queryClient = new QueryClient();
Presets.engineRev();

const ThemeStatusBar = () => {
  const { rt } = useUnistyles();
  return <StatusBar style={rt.themeName === "dark" ? "light" : "dark"} />;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const user = useUser();

  useNotifications();

  if (user === undefined) {
    return null;
  }
  return (
    <OnlineUsersProvider>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <ThemeStatusBar />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!!user}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="car/[id]" />
              <Stack.Screen name="chat/[id]" />
              <Stack.Screen name="user/[userId]/user-cars" />
              <Stack.Screen
                name="car-model/[carName]"
                options={{
                  fullScreenGestureEnabled: false,
                  gestureEnabled: false,
                }}
              />
            </Stack.Protected>
            <Stack.Screen name="auth" />
          </Stack>
        </View>
      </BottomSheetModalProvider>
    </OnlineUsersProvider>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
