import { FiltersModal, FiltersModalRef } from "@/src/ui/components/FiltersModal";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useInfiniteSearchCars } from "../../api/car";
import { useSearchFilters } from "../../hooks/useSearchFilters";
import { UIAutocompleteInput } from "../../ui/UIAutocompleteInput";
import { UIContainer, UIText } from "../../ui";
import { CarItem } from "@/src/ui/components/CarItem";

const sortingTypes = [
  { id: "price_asc", label: "From lowest price" },
  { id: "price_desc", label: "From highest price" },
  { id: "oldest", label: "Oldest first" },
  { id: "newest", label: "Newest first" },
];

export default function SearchScreen() {
  const { theme, rt } = useUnistyles();
  const filtersModalRef = useRef<FiltersModalRef>(null);

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
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteSearchCars(appliedFilters, 5);
  const cars = infiniteData?.pages.flat() ?? [];

  const handleChangeFilters = () => {
    applyFilters();
    filtersModalRef.current?.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            style={styles.filterButton}
            onPress={() => filtersModalRef.current?.present()}
          >
            <Ionicons
              name="filter"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <FiltersModal
          ref={filtersModalRef}
          draftFilters={draftFilters}
          updateDraftFilter={updateDraftFilter}
          handleResetFilters={handleResetFilters}
          handleChangeFilters={handleChangeFilters}
          onClose={() => {}}
        />

        <FlatList
          onRefresh={() => {
            refetchInfiniteData();
          }}
          refreshing={isRefetching}
          data={cars}
          renderItem={({ item }) => {
            return <CarItem item={item} />;
          }}
          keyExtractor={(item) => item?.id || ""}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: rt.insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={50}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <View style={{ padding: theme.spacing.md, alignItems: "center" }}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyListWrapper}>
                <UIText style={styles.emptyListText}>No cars found.</UIText>
                <UIText
                  size="sm"
                  style={{
                    marginTop: theme.spacing.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  Try adjusting filters or press Reset.
                </UIText>
              </View>
            );
          }}
        />

        {(isLoading || isFetching) && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <UIText style={{ marginTop: theme.spacing.sm }}>
                Loading cars...
              </UIText>
            </View>
          </View>
        )}
      </UIContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
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
  },
  sortPicker: {
    flex: 1,
    marginBottom: 0,
  },
}));
