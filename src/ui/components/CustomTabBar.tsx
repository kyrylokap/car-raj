import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useChatsCount } from "../../api/chat";
import { UIText } from "../UIText";

type TabItem = {
  name: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const tabs: TabItem[] = [
  {
    name: "index",
    route: "/(tabs)/",
    icon: "search-outline",
    activeIcon: "search",
    label: "Search",
  },
  {
    name: "chats",
    route: "/(tabs)/chats",
    icon: "chatbubbles-outline",
    activeIcon: "chatbubbles",
    label: "Chats",
  },
  {
    name: "profile",
    route: "/(tabs)/profile",
    icon: "person-outline",
    activeIcon: "person",
    label: "Profile",
  },
];

export const CustomTabBar = () => {
  const { theme } = useUnistyles();
  const router = useRouter();
  const pathname = usePathname();
  const { data: chatsCount } = useChatsCount();
  const isActive = (route: string) => {
    return route.endsWith(pathname);
  };

  const handlePress = (route: string) => {
    router.push(route as any);
  };

  const getBadgeCount = (tabName: string) => {
    if (tabName === "chats") return chatsCount;
    return null;
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
      pointerEvents="box-none"
    >
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handlePress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.tabItemContent}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={active ? tab.activeIcon : tab.icon}
                    size={26}
                    color={
                      active ? theme.colors.primary : theme.colors.textSecondary
                    }
                    style={styles.icon}
                  />
                </View>
                <UIText size="xs" style={styles.label(active)}>
                  {tab.label}
                </UIText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.tabBar,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    minHeight: theme.verticalScale(49),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xs,
    position: "relative",
  },
  tabItemContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.scale(4),
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: theme.scale(28),
    height: theme.scale(28),
    position: "relative",
  },
  icon: {
    position: "relative",
  },
  label: (active: boolean) => ({
    marginTop: 0,
    color: active ? theme.colors.primary : theme.colors.textSecondary,
  }),
  badge: {
    position: "absolute",
    top: theme.scale(-6),
    right: theme.scale(-10),
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    minWidth: theme.scale(18),
    height: theme.scale(18),
    paddingHorizontal: theme.scale(5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: theme.scale(2),
    borderColor: theme.colors.tabBar,
  },
}));
