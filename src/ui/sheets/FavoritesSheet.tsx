import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUserFavorites } from "../../api/favorites";
import { UIText } from "../../ui";
import { UIBottomSheet, UIBottomSheetRef } from "../UIBottomSheet";
import { CarItem } from "../components/CarItem";

export const FavoritesSheet = forwardRef<
  UIBottomSheetRef,
  { onDismiss?: () => void }
>(({ onDismiss }, ref) => {
  const bottomSheetRef = useRef<UIBottomSheetRef>(null);

  const {
    data: cars,
    refetch,
    isRefetching,
    isLoading,
    isFetching,
  } = useUserFavorites();

  const router = useRouter();

  useImperativeHandle(ref, () => bottomSheetRef.current!);

  return (
    <UIBottomSheet
      ref={bottomSheetRef}
      title="My favorites"
      snapPoints={["90%"]}
      enableDynamicSizing={false}
      scrollable={true}
      onDismiss={onDismiss}
    >
        <FlashList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CarItem
              item={item}
              onPress={() => {
                bottomSheetRef.current?.dismiss();
                router.push(`/car/${item.id}`);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading && !isFetching ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="heart-outline"
                  size={64}
                  color={styles.secondaryIcon.color}
                />
                <UIText size="lg" color="textSecondary" style={styles.emptyText}>
                  No favorites yet
                </UIText>
                <UIText size="sm" color="textSecondary" style={styles.emptySubtext}>
                  Add cars to your favorites to see them here
                </UIText>
              </View>
            ) : null
          }
        />
      {(isLoading || isFetching || isRefetching) && (
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
  secondaryIcon: {
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background + "80",
    alignItems: "center",
    justifyContent: "center",
  },
}));
