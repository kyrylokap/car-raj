import { Filter } from "@/src/api/car";
import React, { forwardRef } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIAutocompleteInput } from "../UIAutocompleteInput";
import { UIBottomSheet, UIBottomSheetRef } from "../UIBottomSheet";
import { UIButton } from "../UIButton";
import { UIInput } from "../UIInput";
import { UIText } from "../UIText";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];

interface FiltersModalProps {
  draftFilters: Filter;
  updateDraftFilter: <K extends keyof Filter>(key: K, value: Filter[K]) => void;
  handleResetFilters: () => void;
  handleChangeFilters: () => void;
}

export type { UIBottomSheetRef as FiltersModalRef } from "../UIBottomSheet";

export const FiltersModal = forwardRef<UIBottomSheetRef, FiltersModalProps>(
  (
    {
      draftFilters,
      updateDraftFilter,
      handleResetFilters,
      handleChangeFilters,
    },
    ref,
  ) => {
    return (
      <UIBottomSheet
        ref={ref}
        title="Filters"
        enableDynamicSizing={false}
        snapPoints={["50%", "90%"]}
        footer={
          <View style={styles.footerRow as StyleProp<ViewStyle>}>
            <UIButton
              variant="ghost"
              onPress={handleResetFilters}
              style={styles.resetBtn as StyleProp<ViewStyle>}
            >
              <UIText color="text">Reset</UIText>
            </UIButton>
            <UIButton
              onPress={handleChangeFilters}
              style={styles.applyBtn as StyleProp<ViewStyle>}
            >
              <UIText color="white">Show Results</UIText>
            </UIButton>
          </View>
        }
      >
        <View style={{ paddingTop: 20 }}>
          <View style={styles.section as StyleProp<ViewStyle>}>
            <UIText
              size="md"
              weight="semibold"
              style={styles.sectionTitle as StyleProp<TextStyle>}
            >
              Make & Model
            </UIText>
            <UIAutocompleteInput
              label="Brand"
              placeholder="e.g., BMW"
              value={draftFilters.brand || ""}
              onChangeText={(text) => updateDraftFilter("brand", text)}
              type="brand"
              containerStyle={styles.inputSpacing as StyleProp<ViewStyle>}
            />
            <UIAutocompleteInput
              label="Model"
              placeholder="e.g., 320d"
              value={draftFilters.model || ""}
              onChangeText={(text) => updateDraftFilter("model", text)}
              type="model"
              brandFilter={draftFilters.brand}
            />
          </View>

          <View style={styles.divider as StyleProp<ViewStyle>} />

          <View style={styles.section as StyleProp<ViewStyle>}>
            <UIText
              size="md"
              weight="semibold"
              style={styles.sectionTitle as StyleProp<TextStyle>}
            >
              Price & Year
            </UIText>
            <View style={styles.row as StyleProp<ViewStyle>}>
              <UIInput
                label="Min Price"
                placeholder="0"
                value={draftFilters.minPrice}
                onChangeText={(text) => updateDraftFilter("minPrice", text)}
                containerStyle={styles.halfInput as StyleProp<ViewStyle>}
                keyboardType="numeric"
              />
              <UIInput
                label="Max Price"
                placeholder="50,000+"
                value={draftFilters.maxPrice}
                onChangeText={(text) => updateDraftFilter("maxPrice", text)}
                containerStyle={styles.halfInput as StyleProp<ViewStyle>}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row as StyleProp<ViewStyle>}>
              <UIInput
                label="Min Year"
                placeholder="1990"
                value={draftFilters.minYear}
                onChangeText={(text) => updateDraftFilter("minYear", text)}
                containerStyle={styles.halfInput as StyleProp<ViewStyle>}
                keyboardType="numeric"
              />
              <UIInput
                label="Max Year"
                placeholder={`${new Date().getFullYear()}`}
                value={draftFilters.maxYear}
                onChangeText={(text) => updateDraftFilter("maxYear", text)}
                containerStyle={styles.halfInput as StyleProp<ViewStyle>}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.divider as StyleProp<ViewStyle>} />

          <View style={styles.section as StyleProp<ViewStyle>}>
            <UIText
              size="md"
              weight="semibold"
              style={styles.sectionTitle as StyleProp<TextStyle>}
            >
              Details & Location
            </UIText>
            <View style={styles.row as StyleProp<ViewStyle>}>
              <UIInput
                label="Min Mileage"
                placeholder="0"
                value={draftFilters.minMileage}
                onChangeText={(text) => updateDraftFilter("minMileage", text)}
                containerStyle={styles.halfInput as StyleProp<ViewStyle>}
                keyboardType="numeric"
              />
              <UIInput
                label="Max Mileage"
                placeholder="200,000+"
                value={draftFilters.maxMileage}
                onChangeText={(text) => updateDraftFilter("maxMileage", text)}
                containerStyle={styles.halfInput as StyleProp<ViewStyle>}
                keyboardType="numeric"
              />
            </View>

            <View
              style={[styles.row, { marginBottom: 12 }] as StyleProp<ViewStyle>}
            >
              <View style={styles.halfInput as StyleProp<ViewStyle>}>
                <UIAutocompleteInput
                  label="Fuel Type"
                  placeholder="Any"
                  initialOptions={["Any", ...fuelTypes]}
                  value={draftFilters.fuelType || "Any"}
                  onChangeText={(value) =>
                    updateDraftFilter(
                      "fuelType",
                      value === "Any" ? "" : (value as any),
                    )
                  }
                />
              </View>
              <View style={styles.halfInput as StyleProp<ViewStyle>}>
                <UIAutocompleteInput
                  label="Transmission"
                  placeholder="Any"
                  initialOptions={["Any", ...transmissions]}
                  value={draftFilters.transmission || "Any"}
                  onChangeText={(value) =>
                    updateDraftFilter(
                      "transmission",
                      value === "Any" ? "" : (value as any),
                    )
                  }
                />
              </View>
            </View>

            <UIAutocompleteInput
              label="Location"
              placeholder="City or Region"
              value={draftFilters.location || ""}
              onChangeText={(text) => updateDraftFilter("location", text)}
              type="location"
            />
          </View>
        </View>
      </UIBottomSheet>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: "600",
    fontSize: theme.s(15),
    letterSpacing: 0.2,
  },
  inputSpacing: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  divider: {
    height: theme.s(1),
    backgroundColor: theme.colors.borderLight,
    marginVertical: theme.spacing.lg,
  },
  footerRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  resetBtn: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
  },
  applyBtn: {
    flex: 2,
    borderRadius: theme.borderRadius.lg,
  },
}));
