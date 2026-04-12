import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { UICard, UIText, UIButton } from "../ui";
import { GoogleButton } from "../ui/components/GoogleButton";
import { supabase } from "../api/supabase";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        testID="auth-scroll-view"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logoCircle}>
                <Ionicons
                  name="car-sport"
                  size={28}
                  color="#FFF"
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
                  size={18}
                  color={styles.secondaryIcon.color}
                />
              </View>
              <View style={styles.previewDivider} />
              <View style={styles.previewBottomRow}>
                <View style={styles.previewPill}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={14}
                    color={styles.secondaryIcon.color}
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

            <UIButton
              variant="ghost"
              testID="guest-login-button"
              onPress={async () => {
                const { error } = await supabase.auth.signInWithPassword({
                  email: "test@example.com",
                  password: "password123",
                });
                if (!error) {
                  router.replace("/");
                } else {
                  console.error("Test login failed:", error.message);
                }
              }}
              style={styles.guestButton}
            >
              <UIText size="xs" color="textSecondary" weight="semibold">
                Continue as Guest (Dev Only)
              </UIText>
            </UIButton>

            <UIText size="xxs" color="textSecondary" style={styles.disclaimer}>
              By continuing, you agree to our Terms and acknowledge our Privacy
              Policy.
            </UIText>
          </UICard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  secondaryIcon: {
    color: theme.colors.textSecondary,
  },
  guestButton: {
    marginTop: theme.spacing.sm,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  container: {
    flex: 1,
    gap: theme.spacing.xxl,
    justifyContent: "center",
  },
  header: {
    gap: theme.spacing.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  logoCircle: {
    width: theme.s(44),
    height: theme.s(44),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  title: {
    marginTop: theme.spacing.md,
    fontSize: theme.s(30),
    letterSpacing: -0.5,
  },
  subtitle: {
    maxWidth: theme.s(340),
    lineHeight: 22,
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
    width: theme.s(60),
    height: theme.s(48),
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surfaceVariant,
  },
  previewTextCol: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  previewDivider: {
    height: theme.s(1),
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
    backgroundColor: theme.colors.surfaceVariant,
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
    backgroundColor: theme.colors.surfaceVariant,
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
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  authHint: {
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  disclaimer: {
    marginTop: theme.spacing.xs,
    lineHeight: theme.vs(16),
    textAlign: "center",
  },
}));
