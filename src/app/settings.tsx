import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { Presets } from "react-native-pulsar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from "react-native-unistyles";
import { handleSignOut } from "../api/auth";
import { UICard, UIContainer, UIText } from "../ui";
import {
  PhoneNumberModal,
  PhoneNumberModalRef,
} from "../ui/components/PhoneNumberModal";

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
  const router = useRouter();
  const phoneNumberModalRef = useRef<PhoneNumberModalRef>(null);

  const accountSettings: SettingItem[] = [
    {
      icon: "phone-portrait",
      label: "Phone number",
      subtitle: "Allow customers call you",
      type: "navigation",
      color: "primary",
      onPress: () => phoneNumberModalRef.current?.present(),
    },
  ];

  const appSettings: SettingItem[] = [
    {
      icon: "moon-outline",
      label: "Dark Mode",
      subtitle: "Switch between light and dark theme",
      type: "toggle",
      color: "textSecondary",
    },
    {
      icon: "language-outline",
      label: "Language",
      subtitle: "English",
      value: "English",
      type: "value",
      color: "textSecondary",
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      subtitle: "Get help and contact support",
      type: "navigation",
      color: "textSecondary",
    },

    {
      icon: "information-circle-outline",
      label: "About",
      subtitle: "App version 1.0.0",
      type: "navigation",
      color: "textSecondary",
    },
  ];

  const renderSettingItem = (
    item: SettingItem,
    index: number,
    array: SettingItem[],
  ) => {
    const isLast = index === array.length - 1;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.settingItem, isLast && styles.settingItemLast]}
        activeOpacity={item.type === "toggle" ? 1 : 0.7}
        onPress={() => {
          if (item.type === "navigation") {
            Presets.System.selection();
            if (item.onPress) {
              item.onPress();
            }
          }
        }}
        disabled={item.type === "toggle"}
      >
        <View
          style={[
            styles.settingIconContainer,
            item.color === "primary" ? styles.bgPrimary : styles.bgSecondary,
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={20}
            color={
              item.color === "primary" 
                ? styles.primaryIcon.color 
                : styles.secondaryIcon.color
            }
          />
        </View>
        <View style={styles.settingContent}>
          <UIText weight="medium" style={styles.settingLabel}>
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
            testID="dark-mode-switch"
            value={
              item.label === "Dark Mode"
                ? UnistylesRuntime.themeName === "dark"
                : false
            }
            onValueChange={async (value) => {
              Presets.System.selection();
              if (item.label === "Dark Mode") {
                UnistylesRuntime.setTheme(value ? "dark" : "light");
                await AsyncStorage.setItem(
                  "@auto_raj_theme_mode",
                  value ? "dark" : "light"
                );
              }
            }}
            trackColor={{
              false: styles.switchTrack.borderColor,
              true: styles.switchTrack.color,
            }}
            thumbColor={
              item.label === "Dark Mode"
                ? UnistylesRuntime.themeName === "dark"
                  ? styles.primaryIcon.color
                  : styles.secondaryIcon.color
                : styles.secondaryIcon.color
            }
          />
        )}
        {item.type === "value" && (
          <View style={styles.settingValue}>
            <UIText size="sm" color="textSecondary">
              {item.value}
            </UIText>
            <Ionicons
              hitSlop={14}
              name="chevron-forward"
              size={18}
              color={styles.secondaryIcon.color}
            />
          </View>
        )}
        {item.type === "navigation" && (
          <Ionicons
            name="chevron-forward"
            hitSlop={14}
            size={18}
            color={styles.secondaryIcon.color}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          testID="settings-back-button"
          style={styles.backButton}
          onPress={() => {
            Presets.System.impactLight();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={28} color={styles.headerIcon.color} />
        </TouchableOpacity>
        <UIText size="xxl" weight="bold">
          Settings
        </UIText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <UIContainer>
          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              ACCOUNT
            </UIText>
            {accountSettings.map((item, index) =>
              renderSettingItem(item, index, accountSettings),
            )}
          </UICard>

          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              APP SETTINGS
            </UIText>
            {appSettings.map((item, index) =>
              renderSettingItem(item, index, appSettings),
            )}
          </UICard>

          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              SUPPORT & LEGAL
            </UIText>
            {supportSettings.map((item, index) =>
              renderSettingItem(item, index, supportSettings),
            )}
          </UICard>

          <TouchableOpacity
            onPress={() => {
              Presets.System.impactMedium();
              handleSignOut();
              router.replace("/auth");
            }}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={styles.logoutIcon.color}
            />
            <UIText color="error" weight="semibold">
              Log Out
            </UIText>
          </TouchableOpacity>
        </UIContainer>
      </ScrollView>

      <PhoneNumberModal ref={phoneNumberModalRef} onClose={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  primaryIcon: {
    color: theme.colors.primary,
  },
  secondaryIcon: {
    color: theme.colors.textSecondary,
  },
  bgPrimary: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  bgSecondary: {
    backgroundColor: `${theme.colors.textSecondary}15`,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
  },
  primary: {
    color: theme.colors.primary,
  },
  headerIcon: {
    color: theme.colors.text,
  },
  logoutIcon: {
    color: theme.colors.error,
  },
  switchTrack: {
    color: theme.colors.primary + "40",
    borderColor: theme.colors.border,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingVertical: theme.spacing.lg,
  },
  settingsCard: {
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    padding: 0,
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
    marginBottom: theme.spacing.xl,
  },
}));
