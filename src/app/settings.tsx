import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { StyleSheet } from "react-native-unistyles";
import { handleSignOut } from "../api/auth";
import { useThemeStore } from "../store/themeStore";
import { UICard, UIContainer, UIText } from "../ui";
import {
  PhoneNumberModal,
  PhoneNumberModalRef,
} from "../ui/components/PhoneNumberModal";

export default function SettingsScreen() {
  const router = useRouter();
  const phoneNumberModalRef = useRef<PhoneNumberModalRef>(null);
  const { theme, setTheme } = useThemeStore();

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          testID="settings-back-button"
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={`${styles.headerIcon.color}`}
          />
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
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                phoneNumberModalRef.current?.present();
              }}
            >
              <View style={[styles.settingIconContainer, styles.bgPrimary]}>
                <Ionicons
                  name="phone-portrait"
                  size={20}
                  color={styles.primaryIcon.color}
                />
              </View>
              <View style={styles.settingContent}>
                <UIText weight="medium" style={styles.settingLabel}>
                  Phone number
                </UIText>
                <UIText
                  size="xs"
                  color="textSecondary"
                  style={styles.settingSubtitle}
                >
                  Allow customers call you
                </UIText>
              </View>
              <Ionicons
                name="chevron-forward"
                hitSlop={14}
                size={18}
                color={styles.secondaryIcon.color}
              />
            </TouchableOpacity>
          </UICard>

          <UICard variant="outlined" style={styles.settingsCard}>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.sectionHeader}
            >
              APP SETTINGS
            </UIText>
            <TouchableOpacity style={styles.settingItem} activeOpacity={1}>
              <View style={[styles.settingIconContainer, styles.bgSecondary]}>
                <Ionicons
                  name="moon-outline"
                  size={20}
                  color={styles.secondaryIcon.color}
                />
              </View>
              <View style={styles.settingContent}>
                <UIText weight="medium" style={styles.settingLabel}>
                  Dark Mode
                </UIText>
                <UIText
                  size="xs"
                  color="textSecondary"
                  style={styles.settingSubtitle}
                >
                  Switch between light and dark theme
                </UIText>
              </View>
              <Switch
                testID="dark-mode-switch"
                value={theme === "dark"}
                onValueChange={(value) => {
                  Haptics.selectionAsync();
                  setTheme(value ? "dark" : "light");
                }}
                trackColor={{
                  false: styles.switchTrack.borderColor,
                  true: styles.switchTrack.color,
                }}
                thumbColor={
                  theme === "dark"
                    ? styles.primaryIcon.color
                    : styles.secondaryIcon.color
                }
              />
            </TouchableOpacity>
          </UICard>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

      <PhoneNumberModal ref={phoneNumberModalRef} />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
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
  headerIcon: {
    color: theme.colors.primary,
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
    paddingTop: rt.insets.top,
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
