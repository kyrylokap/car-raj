import { CustomTabBar } from "@/ui/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
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
