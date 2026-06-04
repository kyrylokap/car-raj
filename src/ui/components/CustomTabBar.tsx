import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
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
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (route: string) => {
    return route.endsWith(pathname);
  };

  const handlePress = (route: string) => {
    Haptics.selectionAsync();
    router.push(route as any);
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
                <View
                  style={[
                    styles.iconWrapper,
                    active && styles.iconWrapperActive,
                  ]}
                >
                  <Ionicons
                    name={active ? tab.activeIcon : tab.icon}
                    size={24}
                    color={
                      active
                        ? styles.iconActive.color
                        : styles.iconInactive.color
                    }
                    style={styles.icon}
                  />
                  {active && <View style={styles.activeIndicator} />}
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
  iconActive: {
    color: theme.colors.primary,
  },
  iconInactive: {
    color: theme.colors.textSecondary,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.tabBar,
    borderTopWidth: 0,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    minHeight: theme.vs(60),
    backgroundColor: theme.colors.tabBar,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    position: "relative",
  },
  tabItemContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.s(4),
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: theme.s(32),
    height: theme.s(32),
    position: "relative",
    borderRadius: theme.borderRadius.full,
  },
  iconWrapperActive: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  icon: {
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    width: theme.s(4),
    height: theme.s(4),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  label: (active: boolean) => ({
    marginTop: 0,
    color: active ? theme.colors.text : theme.colors.textSecondary,
    fontWeight: active ? "600" : "400",
    fontSize: theme.s(11),
  }),
  badge: {
    position: "absolute",
    top: theme.s(-6),
    right: theme.s(-10),
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    minWidth: theme.s(18),
    height: theme.s(18),
    paddingHorizontal: theme.s(5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: theme.s(2),
    borderColor: theme.colors.tabBar,
  },
}));
