import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { forwardRef } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { useUserCars } from "../../api/car";
import { UIButton, UIText } from "../../ui";
import { UIBottomSheet, UIBottomSheetRef } from "../UIBottomSheet";
import { CarItem } from "../components/CarItem";

export const MyVehiclesSheet = forwardRef<
  UIBottomSheetRef,
  { onDismiss?: () => void }
>(({ onDismiss }, ref) => {
  const { theme } = useUnistyles();
  const user = useUser();
  const {
    data: cars,
    refetch,
    isRefetching,
    isLoading,
    isFetching,
  } = useUserCars(user?.id!);
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
          <View style={styles.headerRow}>
            <UIText size="sm" color="textSecondary">
              {cars?.length || 0} active listings
            </UIText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                (ref as any).current?.dismiss();
              }}
              hitSlop={14}
            >
              <Ionicons name="add" size={24} color={theme.colors.primary} />
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
            <Ionicons
              name="car-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <UIText size="lg" color="textSecondary" style={styles.emptyText}>
              No vehicles yet
            </UIText>
            <UIButton
              variant="outline"
              style={{ marginTop: 16 }}
              onPress={() => {
                (ref as any).current?.dismiss();
              }}
            >
              <UIText>Sell your first car</UIText>
            </UIButton>
          </View>
        }
      />
      {(isLoading || isFetching || isRefetching) && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </UIBottomSheet>
  );
});

const styles = StyleSheet.create((theme) => ({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  addButton: {
    padding: theme.spacing.xs,
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
  },
  emptyText: {
    marginTop: theme.spacing.md,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background + "80",
    alignItems: "center",
    justifyContent: "center",
  },
}));
