import { useCarsRandom } from "@/api/car";
import { UIButton, UICard, UIContainer, UIInput, UIText } from "@/ui";
import { CarItem } from "@/ui/components/CarItem";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Filter = {
  brand: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  fuelType: string;
  location: string;
};

export default function SearchScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const [showFilters, setShowFilters] = useState(false);
  const { data: cars } = useCarsRandom();

  const [filters, setFilters] = useState<Filter>({
    brand: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    fuelType: "",
    location: "",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <UIContainer>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.searchIcon}
            />
            <UIInput
              placeholder="Search vehicles..."
              style={styles.searchInput}
              containerStyle={styles.searchInputContainer}
            />
          </View>
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

        {showFilters && (
          <UICard variant="elevated" style={styles.filtersCard}>
            <UIText size="lg" style={styles.filtersTitle}>
              Filters
            </UIText>
            <UIInput
              label="Brand"
              placeholder="e.g., BMW, Mercedes"
              value={filters.brand}
              onChangeText={(text) => setFilters({ ...filters, brand: text })}
            />
            <UIInput
              label="Model"
              placeholder="e.g., 320d, C-Class"
              value={filters.model}
              onChangeText={(text) => setFilters({ ...filters, model: text })}
            />
            <View style={styles.row}>
              <UIInput
                label="Min Price"
                placeholder="0"
                value={filters.minPrice}
                onChangeText={(text) =>
                  setFilters({ ...filters, minPrice: text })
                }
                containerStyle={styles.halfInput}
                keyboardType="numeric"
              />
              <UIInput
                label="Max Price"
                placeholder="500000"
                value={filters.maxPrice}
                onChangeText={(text) =>
                  setFilters({ ...filters, maxPrice: text })
                }
                containerStyle={styles.halfInput}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <UIInput
                label="Min Year"
                placeholder="2010"
                value={filters.minYear}
                onChangeText={(text) =>
                  setFilters({ ...filters, minYear: text })
                }
                containerStyle={styles.halfInput}
                keyboardType="numeric"
              />
              <UIInput
                label="Max Year"
                placeholder="2024"
                value={filters.maxYear}
                onChangeText={(text) =>
                  setFilters({ ...filters, maxYear: text })
                }
                containerStyle={styles.halfInput}
                keyboardType="numeric"
              />
            </View>
            <UIInput
              label="Fuel Type"
              placeholder="Petrol, Diesel, Electric"
              value={filters.fuelType}
              onChangeText={(text) =>
                setFilters({ ...filters, fuelType: text })
              }
            />
            <UIInput
              label="Location"
              placeholder="City"
              value={filters.location}
              onChangeText={(text) =>
                setFilters({ ...filters, location: text })
              }
            />
            <View style={styles.filterActions}>
              <UIButton
                variant="outline"
                onPress={() =>
                  setFilters({
                    brand: "",
                    model: "",
                    minPrice: "",
                    maxPrice: "",
                    minYear: "",
                    maxYear: "",
                    fuelType: "",
                    location: "",
                  })
                }
                style={styles.resetButton}
              >
                <UIText weight="semibold">Reset</UIText>
              </UIButton>
              <UIButton
                variant="primary"
                onPress={() => setShowFilters(false)}
                style={styles.applyButton}
              >
                <UIText color="white" weight="semibold">
                  Apply Filters
                </UIText>
              </UIButton>
            </View>
          </UICard>
        )}

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
        />
      </UIContainer>
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
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
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
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
}));
