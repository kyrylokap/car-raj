import { CarItem } from "@/src/ui/components/CarItem";
import {
  FiltersBottomSheet,
  FiltersBottomSheetRef,
} from "@/src/ui/sheets/FiltersBottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useRef } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Presets } from "react-native-pulsar";
import { StyleSheet } from "react-native-unistyles";
import { useInfiniteSearchCars } from "../../api/car";
import { useSearchFilters } from "../../hooks/useSearchFilters";
import { UIContainer, UIText } from "../../ui";
import { UIAutocompleteInput } from "../../ui/UIAutocompleteInput";

const sortingTypes = [
  { id: "price_asc", label: "From lowest price" },
  { id: "price_desc", label: "From highest price" },
  { id: "oldest", label: "Oldest first" },
  { id: "newest", label: "Newest first" },
];

export default function SearchScreen() {
  const filtersBottomSheetRef = useRef<FiltersBottomSheetRef>(null);

  const {
    draftFilters,
    appliedFilters,
    applyFilters,
    handleResetFilters,
    updateDraftFilter,
  } = useSearchFilters();

  const {
    data: infiniteData,
    refetch: refetchInfiniteData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteSearchCars(appliedFilters, 5);
  const cars = infiniteData?.pages.flat() ?? [];

  const handleChangeFilters = () => {
    applyFilters();
    filtersBottomSheetRef.current?.dismiss();
  };

  return (
    <View style={styles.safeArea}>
      <UIContainer>
        <View style={styles.header}>
          {(() => {
            const currentSortLabel =
              sortingTypes.find((s) => s.id === draftFilters.sortBy)?.label ||
              "Sort by";
            return (
              <UIAutocompleteInput
                containerStyle={styles.sortPicker}
                placeholder="Sort by"
                initialOptions={sortingTypes.map((v) => v.label)}
                value={currentSortLabel}
                onChangeText={(label) => {
                  const found = sortingTypes.find((s) => s.label === label);
                  if (found) {
                    updateDraftFilter("sortBy", found.id as any);
                  }
                }}
              />
            );
          })()}
          <TouchableOpacity
            testID="filter-button"
            style={styles.filterButton}
            onPress={() => {
              Presets.System.impactLight();
              filtersBottomSheetRef.current?.present();
            }}
          >
            <Ionicons name="filter" size={20} color={styles.filterIcon.color} />
          </TouchableOpacity>
        </View>
        <FiltersBottomSheet
          ref={filtersBottomSheetRef}
          draftFilters={draftFilters}
          updateDraftFilter={updateDraftFilter}
          handleResetFilters={handleResetFilters}
          handleChangeFilters={handleChangeFilters}
        />

        <FlashList
          testID="search-car-list"
          onRefresh={() => {
            refetchInfiniteData();
          }}
          refreshing={isRefetching}
          data={cars}
          renderItem={({ item, index }) => {
            return <CarItem item={item} testID={`car-item-${index}`} />;
          }}
          keyExtractor={(item) => item?.id || ""}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={styles.filterIcon.color} />
              </View>
            ) : null
          }
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyListWrapper}>
                <UIText style={styles.emptyListText}>No cars found.</UIText>
                <UIText size="sm" style={styles.emptyListSubtitle}>
                  Try adjusting filters or press Reset.
                </UIText>
              </View>
            );
          }}
        />

        {isLoading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={styles.filterIcon.color} />
              <UIText style={styles.loadingText}>Loading cars...</UIText>
            </View>
          </View>
        )}
      </UIContainer>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  filterIcon: {
    color: theme.colors.primary,
  },
  footerLoader: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  emptyListSubtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
  },
  emptyListWrapper: {
    alignItems: "center",
    paddingTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyListText: {
    textAlign: "center",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  loadingCard: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xxl,
    alignItems: "center",
    ...theme.shadows.xl,
    minWidth: "60%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0,
  },

  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  searchInput: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingVertical: theme.spacing.sm,
  },
  filterButton: {
    width: theme.s(48),
    height: theme.s(48),
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.s(1),
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },

  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },

  listContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: rt.insets.bottom + 100,
  },
  sortPicker: {
    flex: 1,
    marginBottom: 0,
  },
}));
