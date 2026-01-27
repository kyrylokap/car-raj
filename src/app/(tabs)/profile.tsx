import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { useUserCarsCount } from "../../api/car";
import { UICard, UIContainer, UIText } from "../../ui";

export default function ProfileScreen() {
  const { theme, rt } = useUnistyles();
  const user = useUser();
  const router = useRouter();
  const { data: userCarsCount } = useUserCarsCount();
  const stats = [
    {
      label: "Vehicles",
      value: userCarsCount,
      icon: "car-outline",
      color: theme.colors.primary,
    },
  ];

  const menuItems = [
    {
      icon: "car-outline",
      label: "My vehicles",
      subtitle: "Manage your vehicles",
      color: theme.colors.primary,
    },
    {
      icon: "heart-outline",
      label: "Favorites",
      subtitle: "Favorite vehicles",
      color: theme.colors.error,
    },
    {
      icon: "settings-outline",
      label: "Settings",
      subtitle: "Preferences & privacy",
      color: theme.colors.textSecondary,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <UIContainer>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: rt.insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={{ uri: user?.user_metadata?.avatar_url }}
                  cachePolicy="memory-disk"
                  transition={200}
                  contentFit="cover"
                  priority="high"
                />
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <UIText size="xl" weight="bold" style={styles.name}>
                    {user?.user_metadata?.full_name}
                  </UIText>
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </View>
                </View>
                <UIText size="sm" color="textSecondary" style={styles.email}>
                  {user?.email}
                </UIText>
              </View>
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  style={styles.statCardWrapper}
                  onPress={() => {
                    if (stat.label === "Vehicles") {
                      router.push("/my-vehicles");
                    }
                  }}
                >
                  <UICard variant="elevated" style={styles.statCard}>
                    <View
                      style={[
                        styles.statIconContainer,
                        { backgroundColor: `${stat.color}15` },
                      ]}
                    >
                      <Ionicons
                        name={stat.icon as any}
                        size={20}
                        color={stat.color}
                      />
                    </View>
                    <UIText
                      size="xxl"
                      color="primary"
                      weight="bold"
                      style={styles.statValue}
                    >
                      {stat.value}
                    </UIText>
                    <UIText size="xs" color="textSecondary" weight="medium">
                      {stat.label}
                    </UIText>
                  </UICard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.quickActionsSection}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.quickActionButton, styles.quickActionPrimary]}
              onPress={() => {
                router.push("/sell-vehicle");
              }}
            >
              <Ionicons name="add-circle" size={22} color={theme.colors.text} />
              <UIText
                size="sm"
                color={"white"}
                weight="semibold"
                style={styles.quickActionLabel}
              >
                Sell vehicle
              </UIText>
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <UICard variant="outlined" style={styles.menuCard}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    index === menuItems.length - 1 && styles.menuItemLast,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.label === "My vehicles") {
                      router.push("/my-vehicles");
                    } else if (item.label === "Settings") {
                      router.push("/settings");
                    } else if (item.label === "Favorites") {
                      router.push("/favorites");
                    }
                  }}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <UIText weight="medium" style={styles.menuLabel}>
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
                    hitSlop={14}
                    size={18}
                    color={theme.colors.textSecondary}
                    style={styles.menuChevron}
                  />
                </TouchableOpacity>
              ))}
            </UICard>
          </View>
        </ScrollView>
      </UIContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  avatarSection: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: theme.s(110),
    height: theme.s(110),
    borderRadius: theme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: theme.s(4),
    borderColor: `${theme.colors.primary}20`,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: theme.s(36),
    height: theme.s(36),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: theme.s(3),
    borderColor: theme.colors.background,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: theme.s(2) },
    shadowOpacity: 0.2,
    shadowRadius: theme.s(4),
    elevation: theme.s(4),
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  name: {
    textAlign: "center",
  },
  verifiedBadge: {
    marginTop: theme.s(2),
  },
  email: {
    marginBottom: theme.spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  location: {
    marginTop: theme.s(1),
  },
  statsSection: {
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  statCardWrapper: {
    flex: 1,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    minHeight: theme.s(110),
  },
  statIconContainer: {
    width: theme.s(36),
    height: theme.s(36),
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    marginBottom: theme.spacing.xs,
  },
  quickActionsSection: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.xs,
  },
  quickActionPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  quickActionLabel: {
    marginTop: theme.s(1),
  },
  menuSection: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  menuCard: {
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
    borderBottomWidth: theme.s(1),
    borderBottomColor: theme.colors.borderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: theme.s(40),
    height: theme.s(40),
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    marginBottom: theme.s(2),
  },
  menuSubtitle: {
    marginTop: theme.s(2),
  },
  menuChevron: {
    marginLeft: theme.spacing.xs,
  },
}));
