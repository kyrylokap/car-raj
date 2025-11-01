import { UICard, UIContainer, UIText } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function ProfileScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();

  const stats = [
    {
      label: "Listings",
      value: "12",
      icon: "car-outline",
      color: theme.colors.primary,
    },
    {
      label: "Messages",
      value: "34",
      icon: "chatbubbles-outline",
      color: theme.colors.primary,
    },
    {
      label: "Sold",
      value: "8",
      icon: "checkmark-circle-outline",
      color: theme.colors.primary,
    },
  ];

  const quickActions = [
    {
      icon: "add-circle",
      label: "Create Listing",
      color: theme.colors.primary,
    },
    { icon: "create", label: "Edit Profile", color: theme.colors.text },
  ];

  const menuItems = [
    {
      icon: "car-outline",
      label: "My Listings",
      subtitle: "Manage your vehicles",
      color: theme.colors.primary,
    },
    {
      icon: "heart-outline",
      label: "Favorites",
      subtitle: "Saved listings",
      color: theme.colors.error,
    },
    {
      icon: "settings-outline",
      label: "Settings",
      subtitle: "Preferences & privacy",
      color: theme.colors.textSecondary,
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      subtitle: "Get assistance",
      color: theme.colors.textSecondary,
    },
    {
      icon: "information-circle-outline",
      label: "About",
      subtitle: "App version & info",
      color: theme.colors.textSecondary,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UIContainer>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: rt.insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <UIText size="xxl" color="white" weight="bold">
                    JD
                  </UIText>
                </View>
                <TouchableOpacity
                  style={styles.editAvatarButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="camera"
                    size={16}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <UIText size="xl" weight="bold" style={styles.name}>
                    John Doe
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
                  john.doe@example.com
                </UIText>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <UIText
                    size="sm"
                    color="textSecondary"
                    style={styles.location}
                  >
                    Warsaw, Poland
                  </UIText>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  style={styles.statCardWrapper}
                  onPress={() => {
                    if (stat.label === "Listings") {
                      router.push("/my-listings");
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

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  style={[
                    styles.quickActionButton,
                    index === 0 && styles.quickActionPrimary,
                  ]}
                  onPress={() => {
                    if (action.label === "Create Listing") {
                      router.push("/create-listing");
                    } else if (action.label === "Edit Profile") {
                      router.push("/edit-profile");
                    }
                  }}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={22}
                    color={index === 0 ? theme.colors.white : theme.colors.text}
                  />
                  <UIText
                    size="sm"
                    color={index === 0 ? "white" : "text"}
                    weight="semibold"
                    style={styles.quickActionLabel}
                  >
                    {action.label}
                  </UIText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Menu Section */}
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
                    if (item.label === "My Listings") {
                      router.push("/my-listings");
                    } else if (item.label === "Settings") {
                      router.push("/settings");
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
                    <UIText
                      size="default"
                      weight="medium"
                      style={styles.menuLabel}
                    >
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

const stylesheet = StyleSheet.create((theme) => ({
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
    width: 110,
    height: 110,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: `${theme.colors.primary}20`,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.background,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    marginTop: 2,
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
    marginTop: 1,
  },
  statsSection: {
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCardWrapper: {
    flex: 1,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    minHeight: 110,
  },
  statIconContainer: {
    width: 36,
    height: 36,
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
    marginTop: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    marginBottom: 2,
  },
  menuSubtitle: {
    marginTop: 2,
  },
  menuChevron: {
    marginLeft: theme.spacing.xs,
  },
}));
