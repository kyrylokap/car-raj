import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useInfiniteSearchCars } from "../../api/car";
import { useSearchFilters } from "../../hooks/useSearchFilters";
import { UIButton, UICard, UIContainer, UIInput, UIText } from "../../ui";
import { CarItem } from "../../ui/components/CarItem";
import { UIPicker } from "../../ui/UIPicker";

const sortingTypes = [
  { id: "price_asc", label: "From lowest price" },
  { id: "price_desc", label: "From highest price" },
  { id: "oldest", label: "Oldest first" },
  { id: "newest", label: "Newest first" },
];

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];

export default function SearchScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const [showFilters, setShowFilters] = useState(false);

  const {
    draftFilters,
    appliedFilters,
    handleChangeFilters: applyFilters,
    handleResetFilters,
    updateDraftFilter,
  } = useSearchFilters();

  const {
    data: infiniteData,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchCars(appliedFilters, 5);
  const cars = infiniteData?.pages.flat() ?? [];

  const handleChangeFilters = () => {
    applyFilters();
    setShowFilters(false);
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
              <UIPicker
                style={styles.sortPicker}
                label="Sort"
                hideLabel
                values={sortingTypes.map((v) => v.label)}
                currentPickerValue={currentSortLabel}
                pick={(label) => {
                  const found = sortingTypes.find((s) => s.label === label);
                  updateDraftFilter(
                    "sortBy",
                    found ? (found.id as any) : ""
                  );
                }}
              />
            );
          })()}
          <TouchableOpacity
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons
              name="filter"
              size={20}
              color={showFilters ? theme.colors.white : theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

          <Modal
            style={{ flex: 1 }}
            transparent={true}
            animationType="slide"
            visible={showFilters}
          >
            <View style={styles.modalOverlay} >
              <View style={styles.modalContainer}>
                <View style={[styles.modalHeader, { paddingTop: rt.insets.top + theme.spacing.sm }]}>
                  <UIText size="lg" style={styles.filtersTitle}>
                    Filters
                  </UIText>
                  <TouchableOpacity
                    onPress={() => setShowFilters(false)}
                    style={styles.modalClose}
                    hitSlop={14}
                  >
                    <Ionicons
                      name="close"
                      size={22}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <KeyboardAvoidingView>
                    <UICard variant="elevated" style={styles.filtersCard}>
                      <UIInput
                        label="Brand"
                        placeholder="e.g., BMW, Mercedes"
                        value={draftFilters.brand}
                        onChangeText={(text) => updateDraftFilter("brand", text)}
                      />
                      <UIInput
                        label="Model"
                        placeholder="e.g., 320d, C-Class"
                        value={draftFilters.model}
                        onChangeText={(text) => updateDraftFilter("model", text)}
                      />
                      <View style={styles.row}>
                        <UIInput
                          label="Min Price"
                          placeholder="eg. 0"
                          value={draftFilters.minPrice}
                          onChangeText={(text) => updateDraftFilter("minPrice", text)}
                          containerStyle={styles.halfInput}
                          keyboardType="numeric"
                        />
                        <UIInput
                          label="Max Price"
                          placeholder="eg. 500000"
                          value={draftFilters.maxPrice}
                          onChangeText={(text) => updateDraftFilter("maxPrice", text)}
                          containerStyle={styles.halfInput}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.row}>
                        <UIInput
                          label="Min Year"
                          placeholder="eg. 1990"
                          value={draftFilters.minYear}
                          onChangeText={(text) => updateDraftFilter("minYear", text)}
                          containerStyle={styles.halfInput}
                          keyboardType="numeric"
                        />
                        <UIInput
                          label="Max Year"
                          placeholder={`eg. ${new Date().getFullYear()}`}
                          value={draftFilters.maxYear}
                          onChangeText={(text) => updateDraftFilter("maxYear", text)}
                          containerStyle={styles.halfInput}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.row}>
                        <UIInput
                          label="Min Mileage"
                          placeholder="eg. 0"
                          value={draftFilters.minMileage}
                          onChangeText={(text) => updateDraftFilter("minMileage", text)}
                          containerStyle={styles.halfInput}
                          keyboardType="numeric"
                        />
                        <UIInput
                          label="Max mileage"
                          placeholder="eg. 340000"
                          value={draftFilters.maxMileage}
                          onChangeText={(text) => updateDraftFilter("maxMileage", text)}
                          containerStyle={styles.halfInput}
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.row}>
                        <UIPicker
                          label="Fuel Type"
                          values={fuelTypes}
                          currentPickerValue={draftFilters.fuelType}
                          pick={(value) => {
                            updateDraftFilter("fuelType", value as any);
                          }}
                        />
                        <UIPicker
                          label="Transmission"
                          values={transmissions}
                          currentPickerValue={draftFilters.transmission}
                          pick={(value) => {
                            updateDraftFilter("transmission", value as any);
                          }}
                        />
                      </View>
                      <UIInput
                        label="Location"
                        placeholder="City"
                        value={draftFilters.location}
                        onChangeText={(text) => updateDraftFilter("location", text)}
                      />
                      <View style={styles.filterActions}>
                        <UIButton
                          variant="outline"
                          onPress={handleResetFilters}
                          style={styles.resetButton}
                        >
                          <UIText weight="semibold">Reset</UIText>
                        </UIButton>
                        <UIButton
                          variant="primary"
                          onPress={handleChangeFilters}
                          style={styles.applyButton}
                        >
                          <UIText color="white" weight="semibold">
                            Apply Filters
                          </UIText>
                        </UIButton>
                      </View>
                    </UICard>
                  </KeyboardAvoidingView>
                </ScrollView>
              </View>
            </View>
          </Modal>
        <FlatList
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

const stylesheet = StyleSheet.create((theme) => ({
  emptyListContainer: {
    flex: 1,
    alignSelf: "center",
    marginTop: theme.spacing.lg,
  },
  emptyListWrapper: {
    alignItems: "center",
    paddingTop: theme.spacing.lg,
  },
  emptyListText: {
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 0,
    margin: 0,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalClose: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginLeft: theme.spacing.md,
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
    width: theme.scale(48),
    height: theme.scale(48),
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.scale(1),
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filtersCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filtersTitle: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  halfInput: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  filterActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  sortPicker: {
    marginRight: theme.spacing.sm,
    justifyContent: "center",
  },
}));
