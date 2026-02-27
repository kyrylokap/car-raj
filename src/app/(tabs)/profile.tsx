import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { useUserCarsCount } from "../../api/car";
import { UIText } from "../../ui";

export default function ProfileScreen() {
  const { theme, rt } = useUnistyles();
  const user = useUser();
  const router = useRouter();
  const { data: userCarsCount } = useUserCarsCount();

  const name = user?.user_metadata?.full_name ?? "User";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  const menuItems = [
    {
      icon: "car-outline",
      label: "My vehicles",
      subtitle: "Manage your active listings",
      color: theme.colors.primary,
      route: "/my-vehicles",
    },
    {
      icon: "heart-outline",
      label: "Favorites",
      subtitle: "Cars you've saved",
      color: theme.colors.error,
      route: "/favorites",
    },
    {
      icon: "settings-outline",
      label: "Settings",
      subtitle: "Preferences & privacy",
      color: theme.colors.textSecondary,
      route: "/settings",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: rt.insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTop}>
          <UIText size="xxl" weight="bold">
            Profile
          </UIText>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            {user?.user_metadata?.avatar_url ? (
              <Image
                style={styles.avatar}
                source={{ uri: user.user_metadata.avatar_url }}
                cachePolicy="memory-disk"
                transition={200}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <UIText style={styles.initials}>{initials}</UIText>
              </View>
            )}
          </View>

          <View style={styles.infoWrap}>
            <View style={styles.nameRow}>
              <UIText size="xl" weight="bold" style={styles.nameText}>
                {name}
              </UIText>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={theme.colors.primary}
                style={styles.verifiedIcon}
              />
            </View>
            <UIText size="sm" color="textSecondary">
              {user?.email}
            </UIText>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.7}
            onPress={() => router.push("/my-vehicles")}
          >
            <View style={styles.statIconWrap}>
              <Ionicons
                name="car-sport"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.statTextWrap}>
              <UIText size="xl" weight="bold" color="primary">
                {userCarsCount ?? 0}
              </UIText>
              <UIText size="xs" color="textSecondary" weight="medium">
                Listings
              </UIText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sellBtn}
            activeOpacity={0.8}
            onPress={() => router.push("/sell-vehicle")}
          >
            <Ionicons name="add" size={26} color="#FFF" />
            <UIText
              size="md"
              weight="bold"
              color="white"
              style={{ marginLeft: 4 }}
            >
              Sell vehicle
            </UIText>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <UIText size="md" weight="semibold" style={styles.menuHeader}>
            ACCOUNT
          </UIText>

          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                activeOpacity={0.7}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  style={[
                    styles.menuIconBox,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.color}
                  />
                </View>

                <View style={styles.menuTextContent}>
                  <UIText size="md" weight="medium">
                    {item.label}
                  </UIText>
                  <UIText
                    size="xs"
                    color="textSecondary"
                    style={styles.menuSubtitle}
                  >
                    {item.subtitle}
                  </UIText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={{ opacity: 0.5 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },

  headerTop: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  avatarWrap: {
    marginBottom: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: theme.s(100),
    height: theme.s(100),
    borderRadius: theme.borderRadius.full,
  },
  avatarFallback: {
    backgroundColor: theme.colors.primary + "18",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary + "33",
  },
  initials: {
    color: theme.colors.primary,
    fontSize: theme.s(36),
    fontWeight: "700",
  },
  infoWrap: {
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  nameText: {
    letterSpacing: -0.5,
  },
  verifiedIcon: {
    marginLeft: 6,
    marginTop: 2,
  },

  actionRow: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statTextWrap: {
    flexDirection: "column",
  },
  sellBtn: {
    flex: 1.5,
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },

  menuSection: {
    paddingHorizontal: theme.spacing.xl,
  },
  menuHeader: {
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.xs,
  },
  menuList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  menuTextContent: {
    flex: 1,
    gap: 2,
  },
  menuSubtitle: {
    opacity: 0.8,
  },
}));
