import "@/src/theme/unistyles";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { UnistylesRuntime } from "react-native-unistyles";
import { useUser } from "../api/auth";
import { useNotifications } from "../api/useNotifications";
import { OnlineUsersProvider } from "../contexts/OnlineUsersContext";

const queryClient = new QueryClient();

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
    <ThemeProvider
      value={UnistylesRuntime.themeName === "dark" ? DarkTheme : DefaultTheme}
    >
      <OnlineUsersProvider>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!!user}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="settings" />
            </Stack.Protected>
            <Stack.Screen name="auth" />
          </Stack>
        </BottomSheetModalProvider>
      </OnlineUsersProvider>
    </ThemeProvider>
  );
}
