import { Tabs } from "expo-router";
import {
  Badge,
  Icon,
  Label,
  NativeTabs,
} from "expo-router/unstable-native-tabs";
import React from "react";
import { Platform, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { CustomTabBar } from "../../ui/components/CustomTabBar";

export default function TabLayout() {
  const isIOS = Platform.OS === "ios";

  if (isIOS) {
    return (
      <NativeTabs tintColor={styles.tint.color}>
        <NativeTabs.Trigger name="index">
          <Label>Search</Label>
          <Icon sf="magnifyingglass" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="chats">
          <Label>Chats</Label>
          <Icon sf="bubble.left.and.bubble.right" />
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

const styles = StyleSheet.create((theme) => ({
  tint: {
    color: theme.colors.primary,
  },
}));
