import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Presets } from "react-native-pulsar";
import { useUser } from "../../api/auth";
import { useUserCarsCount } from "../../api/car";
import { UIText } from "../../ui";
import { UIBottomSheetRef } from "../../ui/UIBottomSheet";
import { FavoritesSheet } from "../../ui/sheets/FavoritesSheet";
import { MyVehiclesSheet } from "../../ui/sheets/MyVehiclesSheet";
import { SellVehicleSheet } from "../../ui/sheets/SellVehicleSheet";

export default function ProfileScreen() {
  const user = useUser();
  const router = useRouter();
  const { data: userCarsCount } = useUserCarsCount();

  const myVehiclesSheetRef = useRef<UIBottomSheetRef>(null);
  const favoritesSheetRef = useRef<UIBottomSheetRef>(null);
  const sellVehicleSheetRef = useRef<UIBottomSheetRef>(null);

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
      color: "primary",
      onPress: () => {
        Presets.System.impactLight();
        myVehiclesSheetRef.current?.present();
      },
    },
    {
      icon: "heart-outline",
      label: "Favorites",
      subtitle: "Cars you've saved",
      color: "error",
      onPress: () => {
        Presets.System.selection();
        favoritesSheetRef.current?.present();
      },
    },
    {
      icon: "settings-outline",
      label: "Settings",
      subtitle: "Preferences & privacy",
      color: "textSecondary",
      onPress: () => {
        Presets.System.selection();
        router.push("/settings");
      },
    },
  ];

  return (
    <SafeAreaView testID="profile-screen" style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
                color={styles.primaryIcon.color}
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
            onPress={() => {
              Presets.System.impactLight();
              myVehiclesSheetRef.current?.present();
            }}
          >
            <View style={styles.statIconWrap}>
              <Ionicons
                name="car-sport"
                size={24}
                color={styles.primaryIcon.color}
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
            onPress={() => {
              Presets.System.impactLight();
              sellVehicleSheetRef.current?.present();
            }}
          >
            <Ionicons name="add" size={26} color={styles.whiteIcon.color} />
            <UIText size="md" weight="bold" color="white">
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
                onPress={item.onPress}
              >
                <View
                  style={[
                    styles.menuIconBox,
                    item.color === "primary" && styles.bgPrimary,
                    item.color === "error" && styles.bgError,
                    item.color === "textSecondary" && styles.bgSecondary,
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={
                      item.color === "primary" 
                        ? styles.primaryIcon.color 
                        : item.color === "error" 
                          ? styles.errorIcon.color 
                          : styles.secondaryIcon.color
                    }
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
                  color={styles.secondaryIcon.color}
                  style={{ opacity: 0.5 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <MyVehiclesSheet
        ref={myVehiclesSheetRef}
        onSellPress={() => {
          sellVehicleSheetRef.current?.present();
        }}
      />
      <FavoritesSheet ref={favoritesSheetRef} />
      <SellVehicleSheet ref={sellVehicleSheetRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  primaryIcon: {
    color: theme.colors.primary,
  },
  secondaryIcon: {
    color: theme.colors.textSecondary,
  },
  primary: {
    color: theme.colors.primary,
  },
  error: {
    color: theme.colors.error,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
  },
  whiteIcon: {
    color: theme.colors.white,
  },
  errorIcon: {
    color: theme.colors.error,
  },
  bgPrimary: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  bgError: {
    backgroundColor: `${theme.colors.error}15`,
  },
  bgSecondary: {
    backgroundColor: `${theme.colors.textSecondary}15`,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: rt.insets.bottom + 100,
  },

  headerTop: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  avatarWrap: {
    marginBottom: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: theme.s(110),
    height: theme.s(110),
    borderRadius: theme.borderRadius.full,
    borderWidth: 3,
    borderColor: theme.colors.surface,
    ...theme.shadows.lg,
  },
  avatarFallback: {
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary + "30",
  },
  initials: {
    color: theme.colors.primary,
    fontSize: theme.s(40),
    fontWeight: "700",
  },
  infoWrap: {
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },
  nameText: {
    letterSpacing: -0.5,
  },
  verifiedIcon: {
    marginLeft: theme.spacing.sm,
    marginTop: 2,
  },

  actionRow: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.md,
    justifyContent: "center",
    ...theme.shadows.md,
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statTextWrap: {
    flexDirection: "column",
  },
  sellBtn: {
    gap: theme.s(4),
    flex: 1.5,
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xxl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },

  menuSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  menuHeader: {
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.xs,
    fontSize: theme.s(13),
    fontWeight: "600",
  },
  menuList: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xxl,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.surfaceElevated,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  menuTextContent: {
    flex: 1,
    gap: theme.s(4),
  },
  menuSubtitle: {
    opacity: 0.7,
    fontSize: theme.s(13),
  },
}));
