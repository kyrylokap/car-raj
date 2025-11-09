import { ThemeProvider as ThemeContextProvider } from "@/contexts/ThemeContext";
import "@/unistyles";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { useUser } from "@/api/auth";
import { useThemeContext } from "@/contexts/ThemeContext";
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <RootLayoutNav />
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { isDarkMode } = useThemeContext();
  const user = useUser();
  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="chat/[id]"
            options={{ presentation: "modal", headerShown: false }}
          />

          <Stack.Screen
            name="car/[id]"
            options={{ presentation: "fullScreenModal", headerShown: false }}
          />
          <Stack.Screen
            name="user/[userId]/cars"
            options={{ presentation: "fullScreenModal", headerShown: false }}
          />
          <Stack.Screen
            name="my-vehicles"
            options={{ presentation: "fullScreenModal", headerShown: false }}
          />
          <Stack.Screen
            name="sell-vehicle"
            options={{ presentation: "fullScreenModal", headerShown: false }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{ presentation: "fullScreenModal", headerShown: false }}
          />
          <Stack.Screen
            name="settings"
            options={{ presentation: "fullScreenModal", headerShown: false }}
          />
          <Stack.Screen
            name="favorites"
            options={{ presentation: "fullScreenModal", headerShown: false }}
          />
        </Stack.Protected>
        <Stack.Screen
          name="auth"
          options={{ presentation: "fullScreenModal", headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
