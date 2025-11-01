import { CustomTabBar } from "@/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: "/(tabs)",
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            href: "/(tabs)/chats",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: "/(tabs)/profile",
          }}
        />
      </Tabs>
      <CustomTabBar />
    </View>
  );
}
