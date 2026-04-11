import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
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
  const { theme } = useUnistyles();
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
      scrollable={false}
      onDismiss={onDismiss}
    >
      <BottomSheetFlatList
        data={cars}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={({ item }) => (
          <CarItem
            item={item}
            onPress={() => {
              bottomSheetRef.current?.dismiss();
              router.push(`/car/${item.id}`);
            }}
          />
        )}
        keyExtractor={(item) => item?.id || ""}
        contentContainerStyle={[
          styles.listContent,
          !cars?.length && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="heart-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <UIText size="lg" color="textSecondary" style={styles.emptyText}>
              No favorites yet
            </UIText>
            <UIText size="sm" color="textSecondary" style={styles.emptySubtext}>
              Add cars to your favorites to see them here
            </UIText>
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
