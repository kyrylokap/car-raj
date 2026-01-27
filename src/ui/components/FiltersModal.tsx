import { Filter } from "@/src/api/car";
import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UIButton } from "../UIButton";
import { UICard } from "../UICard";
import { UIInput } from "../UIInput";
import { UIPicker } from "../UIPicker";
import { UIText } from "../UIText";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];

interface FiltersModalProps {
  visible: boolean;
  close: () => void;
  draftFilters: Filter;
  updateDraftFilter: (key: keyof Filter, value: string) => void;
  handleResetFilters: () => void;
  handleChangeFilters: () => void;
}

export const FiltersModal = ({
  visible,
  close,
  draftFilters,
  updateDraftFilter,
  handleResetFilters,
  handleChangeFilters,
}: FiltersModalProps) => {
  const { theme } = useUnistyles();
  return (
    <Modal
      style={{ flex: 1 }}
      transparent={true}
      animationType="slide"
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalHeader,
              //   { paddingTop: rt.insets.top + theme.spacing.sm },
            ]}
          >
            <UIText size="lg" style={styles.filtersTitle}>
              Filters
            </UIText>
            <TouchableOpacity
              onPress={close}
              style={styles.modalClose}
              hitSlop={14}
            >
              <Ionicons name="close" size={22} color={theme.colors.text} />
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
                    onChangeText={(text) =>
                      updateDraftFilter("minMileage", text)
                    }
                    containerStyle={styles.halfInput}
                    keyboardType="numeric"
                  />
                  <UIInput
                    label="Max mileage"
                    placeholder="eg. 340000"
                    value={draftFilters.maxMileage}
                    onChangeText={(text) =>
                      updateDraftFilter("maxMileage", text)
                    }
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
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  modalOverlay: {
    paddingTop: rt.insets.top,
    flex: 1,
    backgroundColor: theme.colors.background,
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
}));
