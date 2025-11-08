import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
    name: "two",
    route: "/(tabs)/chats",
    icon: "chatbubbles-outline",
    activeIcon: "chatbubbles",
    label: "Messages",
  },
  {
    name: "profile",
    route: "/(tabs)/profile",
    icon: "person-outline",
    activeIcon: "person",
    label: "Profile",
  },
];

export const CustomTabBar: React.FC = () => {
  const { theme } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (route: string) => {
    if (route === "/(tabs)/") {
      return (
        pathname === "/" || pathname === "/(tabs)" || pathname === "/(tabs)/"
      );
    }
    return pathname === route || pathname.startsWith(route);
  };

  const handlePress = (route: string) => {
    router.push(route as any);
  };

  // Mock badge count for messages tab
  const getBadgeCount = (tabName: string) => {
    if (tabName === "two") return 3;
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
          const badgeCount = getBadgeCount(tab.name);

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
                      active && tab.name === "index"
                        ? theme.colors.primary
                        : active
                        ? theme.colors.text
                        : theme.colors.textSecondary
                    }
                    style={styles.icon}
                  />
                  {badgeCount !== null && badgeCount > 0 && (
                    <View style={styles.badge}>
                      <UIText size="xxs" color="white" weight="bold">
                        {badgeCount > 9 ? "9+" : badgeCount}
                      </UIText>
                    </View>
                  )}
                </View>
                <UIText
                  size="xxs"
                  color={
                    active && tab.name === "index"
                      ? "primary"
                      : active
                      ? "text"
                      : "textSecondary"
                  }
                  weight={active ? "semibold" : "normal"}
                  style={styles.label}
                >
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

const stylesheet = StyleSheet.create((theme) => ({
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
    minHeight: 49,
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
    gap: 4,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    position: "relative",
  },
  icon: {
    position: "relative",
  },
  label: {
    marginTop: 0,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.tabBar,
  },
}));
