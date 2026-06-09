import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { supabase } from "../api/supabase";
import { UIButton, UIText } from "../ui";
import { GoogleButton } from "../ui/components/GoogleButton";

const UniImage = withUnistyles(Image);

export default function AuthScreen() {
  // const router = useRouter();

  return (
    <View style={styles.safeArea}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <UniImage
          source={require("../../assets/images/icon.png")}
          style={styles.logoCircle}
          contentFit="contain"
        />

        <UIText size="xxl" weight="extrabold" style={styles.headline}>
          Find your next
        </UIText>
        <UIText size="xxl" weight="extrabold" color="primary">
          dream car
        </UIText>

        <UIText size="sm" color="textSecondary" style={styles.tagline}>
          Browse thousands of listings, chat with sellers, and find the perfect
          ride.
        </UIText>
      </View>

      {/* Feature Pills */}
      <View style={styles.features}>
        <View style={styles.featurePill}>
          <Ionicons
            name="search"
            size={16}
            color={styles.featureIconColor.color}
          />
          <UIText size="xs" weight="medium">
            Browse
          </UIText>
        </View>
        <View style={styles.featurePill}>
          <Ionicons
            name="heart"
            size={16}
            color={styles.featureIconColor.color}
          />
          <UIText size="xs" weight="medium">
            Favorites
          </UIText>
        </View>
        <View style={styles.featurePill}>
          <Ionicons
            name="chatbubbles"
            size={16}
            color={styles.featureIconColor.color}
          />
          <UIText size="xs" weight="medium">
            Chat
          </UIText>
        </View>
        <View style={styles.featurePill}>
          <Ionicons
            name="cube"
            size={16}
            color={styles.featureIconColor.color}
          />
          <UIText size="xs" weight="medium">
            3D View
          </UIText>
        </View>
      </View>

      {/* Mock Listing Card */}
      <View style={styles.mockCard}>
        <View style={styles.mockCardImage}>
          <Ionicons
            name="car-sport-outline"
            size={28}
            color={styles.mockPlaceholderIcon.color}
          />
        </View>
        <View style={styles.mockCardContent}>
          <UIText size="sm" weight="semibold" numberOfLines={1}>
            Toyota Supra MK4
          </UIText>
          <UIText size="xs" color="textSecondary" numberOfLines={1}>
            120 000 km · Petrol · Tokyo
          </UIText>
          <View style={styles.mockCardFooter}>
            <UIText size="xs" weight="bold" color="primary">
              $45 000
            </UIText>
            <Ionicons
              name="heart-outline"
              size={16}
              color={styles.featureIconColor.color}
            />
          </View>
        </View>
      </View>

      {/* Auth Section */}
      <View style={styles.authSection}>
        <GoogleButton />
        {/*
        <UIButton
          variant="ghost"
          size="medium"
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
          <UIText size="sm" color="textSecondary" weight="medium">
            Continue as Guest
          </UIText>
        </UIButton>*/}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
  },

  // Hero
  hero: {
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },

  logoCircle: {
    width: "100%",
    height: theme.vs(200),
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    fontSize: theme.s(34),
    letterSpacing: -1,
    lineHeight: theme.vs(40),
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
    maxWidth: theme.s(300),
    lineHeight: theme.vs(22),
    marginTop: theme.spacing.sm,
  },

  // Feature pills
  features: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
  },
  featureIconColor: {
    color: theme.colors.primary,
  },

  // Mock card
  mockCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  mockCardImage: {
    width: theme.s(90),
    height: theme.s(80),
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  mockPlaceholderIcon: {
    color: theme.colors.textTertiary,
  },
  mockCardContent: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  mockCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
  },

  // Auth section
  authSection: {
    gap: theme.spacing.md,
    alignItems: "center",
  },
  guestButton: {
    width: "100%",
  },
}));
