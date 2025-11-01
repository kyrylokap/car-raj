import { UICard, UIContainer, UIText } from "@/components/ui";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type SettingItem = {
  icon: string;
  label: string;
  subtitle?: string;
  value?: string;
  type: "navigation" | "toggle" | "value";
  onPress?: () => void;
  color?: string;
};

export default function SettingsScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeContext();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const accountSettings: SettingItem[] = [
    {
      icon: "person-outline",
      label: "Account",
      subtitle: "Manage your account",
      type: "navigation",
      color: theme.colors.primary,
    },
    {
      icon: "lock-closed-outline",
      label: "Privacy & Security",
      subtitle: "Password, privacy settings",
      type: "navigation",
      color: theme.colors.primary,
    },
    {
      icon: "card-outline",
      label: "Payment Methods",
      subtitle: "Manage payment options",
      type: "navigation",
      color: theme.colors.primary,
    },
  ];

  const notificationSettings: SettingItem[] = [
    {
      icon: "notifications-outline",
      label: "Push Notifications",
      subtitle: "Receive notifications on your device",
      type: "toggle",
      color: theme.colors.primary,
    },
    {
      icon: "mail-outline",
      label: "Email Notifications",
      subtitle: "Receive updates via email",
      type: "toggle",
      color: theme.colors.primary,
    },
    {
      icon: "chatbubbles-outline",
      label: "Message Notifications",
      subtitle: "New messages and inquiries",
      type: "toggle",
      color: theme.colors.primary,
    },
  ];

  const appSettings: SettingItem[] = [
    {
      icon: "moon-outline",
      label: "Dark Mode",
      subtitle: "Switch between light and dark theme",
      type: "toggle",
      color: theme.colors.textSecondary,
    },
    {
      icon: "language-outline",
      label: "Language",
      subtitle: "English",
      value: "English",
      type: "value",
      color: theme.colors.textSecondary,
    },
    {
      icon: "save-outline",
      label: "Auto-save Drafts",
      subtitle: "Automatically save listing drafts",
      type: "toggle",
      color: theme.colors.textSecondary,
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      subtitle: "Get help and contact support",
      type: "navigation",
      color: theme.colors.textSecondary,
    },
    {
      icon: "document-text-outline",
      label: "Terms of Service",
      type: "navigation",
      color: theme.colors.textSecondary,
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy Policy",
      type: "navigation",
      color: theme.colors.textSecondary,
    },
    {
      icon: "information-circle-outline",
      label: "About",
      subtitle: "App version 1.0.0",
      type: "navigation",
      color: theme.colors.textSecondary,
    },
  ];

  const renderSettingItem = (
    item: SettingItem,
    index: number,
    array: SettingItem[]
  ) => {
    const isLast = index === array.length - 1;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.settingItem, isLast && styles.settingItemLast]}
        activeOpacity={item.type === "toggle" ? 1 : 0.7}
        onPress={() => {
          if (item.type === "navigation" && item.onPress) {
            item.onPress();
          }
        }}
        disabled={item.type === "toggle"}
      >
        <View
          style={[
            styles.settingIconContainer,
            { backgroundColor: `${item.color || theme.colors.primary}15` },
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={20}
            color={item.color || theme.colors.primary}
          />
        </View>
        <View style={styles.settingContent}>
          <UIText size="default" weight="medium" style={styles.settingLabel}>
            {item.label}
          </UIText>
          {item.subtitle && (
            <UIText
              size="xs"
              color="textSecondary"
              style={styles.settingSubtitle}
            >
              {item.subtitle}
            </UIText>
          )}
        </View>
        {item.type === "toggle" && (
          <Switch
            value={
              item.label === "Push Notifications"
                ? pushNotifications
                : item.label === "Email Notifications"
                ? emailNotifications
                : item.label === "Message Notifications"
                ? notificationsEnabled
                : item.label === "Dark Mode"
                ? isDarkMode
                : item.label === "Auto-save Drafts"
                ? autoSave
                : false
            }
            onValueChange={(value) => {
              if (item.label === "Push Notifications") {
                setPushNotifications(value);
              } else if (item.label === "Email Notifications") {
                setEmailNotifications(value);
              } else if (item.label === "Message Notifications") {
                setNotificationsEnabled(value);
              } else if (item.label === "Dark Mode") {
                toggleTheme();
              } else if (item.label === "Auto-save Drafts") {
                setAutoSave(value);
              }
            }}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary + "40",
            }}
            thumbColor={
              item.label === "Push Notifications"
                ? pushNotifications
                  ? theme.colors.primary
                  : theme.colors.textSecondary
                : item.label === "Email Notifications"
                ? emailNotifications
                  ? theme.colors.primary
                  : theme.colors.textSecondary
                : item.label === "Message Notifications"
                ? notificationsEnabled
                  ? theme.colors.primary
                  : theme.colors.textSecondary
                : item.label === "Dark Mode"
                ? isDarkMode
                  ? theme.colors.primary
                  : theme.colors.textSecondary
                : item.label === "Auto-save Drafts"
                ? autoSave
                  ? theme.colors.primary
                  : theme.colors.textSecondary
                : theme.colors.textSecondary
            }
          />
        )}
        {item.type === "value" && (
          <View style={styles.settingValue}>
            <UIText size="sm" color="textSecondary">
              {item.value}
            </UIText>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </View>
        )}
        {item.type === "navigation" && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textSecondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <UIText size="xl" weight="bold" style={styles.headerTitle}>
          Settings
        </UIText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: rt.insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <UIContainer>
          {/* Account Settings */}
          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              ACCOUNT
            </UIText>
            {accountSettings.map((item, index) =>
              renderSettingItem(item, index, accountSettings)
            )}
          </UICard>

          {/* Notifications */}
          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              NOTIFICATIONS
            </UIText>
            {notificationSettings.map((item, index) =>
              renderSettingItem(item, index, notificationSettings)
            )}
          </UICard>

          {/* App Settings */}
          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              APP SETTINGS
            </UIText>
            {appSettings.map((item, index) =>
              renderSettingItem(item, index, appSettings)
            )}
          </UICard>

          {/* Support & Legal */}
          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              SUPPORT & LEGAL
            </UIText>
            {supportSettings.map((item, index) =>
              renderSettingItem(item, index, supportSettings)
            )}
          </UICard>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.error}
            />
            <UIText size="default" color="error" weight="semibold">
              Log Out
            </UIText>
          </TouchableOpacity>
        </UIContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  settingsCard: {
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  settingLabel: {
    marginBottom: 2,
  },
  settingSubtitle: {
    marginTop: 2,
  },
  settingValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.error}10`,
    borderWidth: 1,
    borderColor: `${theme.colors.error}20`,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
}));
