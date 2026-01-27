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

import { UnistylesRuntime } from "react-native-unistyles";
import { useUser } from "../api/auth";
import { useNotifications } from "../api/useNotifications";
import { OnlineUsersProvider } from "../contexts/OnlineUsersContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!!user}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="chat/[id]"
              options={{ presentation: "modal" }}
            />

            <Stack.Screen name="car/[id]" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="user/[userId]/user-cars"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="my-vehicles"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="sell-vehicle"
              options={{ presentation: "modal" }}
            />

            <Stack.Screen name="settings" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="favorites"
              options={{ presentation: "modal" }}
            />
          </Stack.Protected>
          <Stack.Screen name="auth" options={{ presentation: "modal" }} />
        </Stack>
      </OnlineUsersProvider>
    </ThemeProvider>
  );
}
