import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UICard, UIText } from "../ui";
import { GoogleButton } from "../ui/components/GoogleButton";

export default function AuthScreen() {
  const { theme } = useUnistyles();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="car-sport"
                size={theme.s(28)}
                color={theme.colors.white}
              />
            </View>
            <UIText size="lg" weight="bold">
              Auto Raj
            </UIText>
          </View>

          <UIText size="xxl" weight="bold" style={styles.title}>
            Preview the app
          </UIText>
          <UIText size="sm" color="textSecondary" style={styles.subtitle}>
            Browse listings, chat with sellers, and save favorites. Sign in to
            continue.
          </UIText>
        </View>

        <View style={styles.previewGrid}>
          <UICard variant="outlined" style={styles.previewCard}>
            <View style={styles.previewTopRow}>
              <View style={styles.previewImage} />
              <View style={styles.previewTextCol}>
                <UIText size="sm" weight="semibold" numberOfLines={1}>
                  BMW 3 Series 2017
                </UIText>
                <UIText size="xs" color="textSecondary" numberOfLines={1}>
                  89 000 km • Petrol • Warsaw
                </UIText>
              </View>
              <Ionicons
                name="heart-outline"
                size={theme.s(18)}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.previewDivider} />
            <View style={styles.previewBottomRow}>
              <View style={styles.previewPill}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={theme.s(14)}
                  color={theme.colors.textSecondary}
                />
                <UIText size="xs" style={styles.previewPillText}>
                  Chat
                </UIText>
              </View>
              <UIText size="xs" color="textSecondary">
                From 55 000 PLN
              </UIText>
            </View>
          </UICard>

          <UICard variant="outlined" style={styles.previewCard}>
            <View style={styles.previewHeaderRow}>
              <UIText size="sm" weight="semibold">
                Messages
              </UIText>
              <View style={styles.unreadDot} />
            </View>

            <View style={styles.messageRow}>
              <View style={styles.avatar} />
              <View style={styles.messageTextCol}>
                <View style={styles.messageTopRow}>
                  <UIText size="sm" weight="semibold" numberOfLines={1}>
                    Alex
                  </UIText>
                  <UIText size="xs" color="textSecondary">
                    12:41
                  </UIText>
                </View>
                <UIText size="xs" color="textSecondary" numberOfLines={1}>
                  Is it still available? I can come today.
                </UIText>
              </View>
            </View>
          </UICard>
        </View>

        <UICard variant="elevated" style={styles.authCard}>
          <UIText size="md" weight="semibold">
            Sign in to continue
          </UIText>
          <UIText size="xs" color="textSecondary" style={styles.authHint}>
            Save favorites, contact sellers, and post your car.
          </UIText>

          <GoogleButton />

          <UIText size="xxs" color="textSecondary" style={styles.disclaimer}>
            By continuing, you agree to our Terms and acknowledge our Privacy
            Policy.
          </UIText>
        </UICard>
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
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  logoCircle: {
    width: theme.s(36),
    height: theme.s(36),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: theme.spacing.sm,
  },
  subtitle: {
    maxWidth: theme.s(340),
  },
  previewGrid: {
    gap: theme.spacing.md,
  },
  previewCard: {
    gap: theme.spacing.sm,
  },
  previewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  previewImage: {
    width: theme.s(56),
    height: theme.s(44),
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  previewTextCol: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  previewDivider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },
  previewBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
  },
  previewPillText: {
    lineHeight: theme.vs(16),
  },
  previewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unreadDot: {
    width: theme.s(8),
    height: theme.s(8),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  avatar: {
    width: theme.s(36),
    height: theme.s(36),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
  },
  messageTextCol: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  messageTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  authCard: {
    gap: theme.spacing.sm,
  },
  authHint: {
    marginTop: -theme.spacing.xs,
  },
  disclaimer: {
    marginTop: theme.spacing.xs,
    lineHeight: theme.vs(16),
  },
}));
