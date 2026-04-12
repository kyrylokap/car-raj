import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { forwardRef } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Presets } from "react-native-pulsar";
import { StyleSheet } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { useUserCars } from "../../api/car";
import { UIText } from "../../ui";
import { UIBottomSheet, UIBottomSheetRef } from "../UIBottomSheet";
import { CarItem } from "../components/CarItem";

export const MyVehiclesSheet = forwardRef<
  UIBottomSheetRef,
  { onDismiss?: () => void; onSellPress?: () => void }
>(({ onDismiss, onSellPress }, ref) => {
  const user = useUser();
  const { data: cars, isLoading } = useUserCars(user?.id!);
  return (
    <UIBottomSheet
      ref={ref}
      title="My vehicles"
      snapPoints={["80%"]}
      enableDynamicSizing={false}
      scrollable={false}
      onDismiss={onDismiss}
    >
      <BottomSheetFlatList
        data={cars}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerPanel}>
            <View style={styles.statsBlock}>
              <UIText size="lg" weight="bold">
                {cars?.length || 0}
              </UIText>
              <UIText size="xs" color="textSecondary" weight="medium">
                Active Listings
              </UIText>
            </View>

            <TouchableOpacity
              style={styles.headerSellBtn}
              activeOpacity={0.8}
              onPress={() => {
                Presets.System.impactLight();
                onSellPress?.();
                (ref as any).current?.dismiss();
              }}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <UIText size="sm" weight="bold" color="white">
                Sell New
              </UIText>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <CarItem
            item={item}
            onPress={() => {
              (ref as any).current?.dismiss();
              router.push(`/car/${item?.id}`);
            }}
          />
        )}
        keyExtractor={(item) => item?.id || ""}
        contentContainerStyle={[styles.listContent]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="car-sport-outline"
                size={42}
                color={styles.primaryIcon.color}
              />
            </View>
            <UIText size="lg" weight="bold" style={styles.emptyTitle}>
              Your garage is empty
            </UIText>
            <UIText
              size="sm"
              color="textSecondary"
              style={styles.emptySubtitle}
            >
              You haven't listed any vehicles yet. Let's get your first car seen
              by thousands of buyers.
            </UIText>
            <TouchableOpacity
              style={styles.sellCardCTA}
              activeOpacity={0.8}
              onPress={() => {
                Presets.System.impactLight();
                if (onSellPress) {
                  onSellPress();
                } else {
                  (ref as any).current?.dismiss();
                }
              }}
            >
              <Ionicons name="add-circle" size={24} color="#FFF" />
              <UIText weight="bold" color="white">
                List My Vehicle
              </UIText>
            </TouchableOpacity>
          </View>
        }
      />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={styles.primaryIcon.color} />
        </View>
      )}
    </UIBottomSheet>
  );
});

const styles = StyleSheet.create((theme) => ({
  primaryIcon: {
    color: theme.colors.primary,
  },
  headerPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
  },
  statsBlock: {
    gap: 2,
  },
  headerSellBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  carCard: {
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  carItem: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  carImageContainer: {
    width: theme.s(100),
    height: theme.s(100),
    position: "relative",
  },
  carImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.borderRadius.md,
  },
  carImagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
  },
  soldBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  carInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  carTitle: {
    marginBottom: 2,
  },
  carYear: {
    marginBottom: 4,
  },
  carFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + "12",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  emptySubtitle: {
    textAlign: "center",
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  sellCardCTA: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.md,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
}));
