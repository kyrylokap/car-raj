import { Tabs } from "expo-router";
import {
  Badge,
  Icon,
  Label,
  NativeTabs,
} from "expo-router/unstable-native-tabs";
import React from "react";
import { Platform, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useChatsCount } from "../../api/chat";
import { CustomTabBar } from "../../ui/components/CustomTabBar";

export default function TabLayout() {
  const { theme } = useUnistyles();
  const { data: chatsCount } = useChatsCount();
  const isIOS = Platform.OS === "ios";

  if (isIOS) {
    return (
      <NativeTabs tintColor={theme.colors.primary}>
        <NativeTabs.Trigger name="index">
          <Label>Search</Label>
          <Icon sf="magnifyingglass" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="chats">
          <Label>Chats</Label>
          <Icon sf="bubble.left.and.bubble.right" />
          {chatsCount !== undefined && chatsCount > 0 && (
            <Badge>{chatsCount.toString()}</Badge>
          )}
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon sf="person" />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

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
