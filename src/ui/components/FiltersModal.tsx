import { Filter } from "@/src/api/car";
import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton } from "../UIButton";
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
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <UIText size="xl" weight="bold" style={styles.headerTitle}>
                Filters
              </UIText>
              <TouchableOpacity
                onPress={close}
                style={styles.closeBtn}
                hitSlop={10}
              >
                <Ionicons name="close" size={24} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.section}>
                <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                  Make & Model
                </UIText>
                <UIInput
                  label="Brand"
                  placeholder="e.g., BMW, Mercedes"
                  value={draftFilters.brand}
                  onChangeText={(text) => updateDraftFilter("brand", text)}
                  containerStyle={styles.inputSpacing}
                />
                <UIInput
                  label="Model"
                  placeholder="e.g., 320d, C-Class"
                  value={draftFilters.model}
                  onChangeText={(text) => updateDraftFilter("model", text)}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                  Price & Year
                </UIText>
                <View style={styles.row}>
                  <UIInput
                    label="Min Price"
                    placeholder="0"
                    value={draftFilters.minPrice}
                    onChangeText={(text) => updateDraftFilter("minPrice", text)}
                    containerStyle={styles.halfInput}
                    keyboardType="numeric"
                  />
                  <UIInput
                    label="Max Price"
                    placeholder="50,000+"
                    value={draftFilters.maxPrice}
                    onChangeText={(text) => updateDraftFilter("maxPrice", text)}
                    containerStyle={styles.halfInput}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.row}>
                  <UIInput
                    label="Min Year"
                    placeholder="1990"
                    value={draftFilters.minYear}
                    onChangeText={(text) => updateDraftFilter("minYear", text)}
                    containerStyle={styles.halfInput}
                    keyboardType="numeric"
                  />
                  <UIInput
                    label="Max Year"
                    placeholder={`${new Date().getFullYear()}`}
                    value={draftFilters.maxYear}
                    onChangeText={(text) => updateDraftFilter("maxYear", text)}
                    containerStyle={styles.halfInput}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                  Details & Location
                </UIText>
                <View style={styles.row}>
                  <UIInput
                    label="Min Mileage"
                    placeholder="0"
                    value={draftFilters.minMileage}
                    onChangeText={(text) =>
                      updateDraftFilter("minMileage", text)
                    }
                    containerStyle={styles.halfInput}
                    keyboardType="numeric"
                  />
                  <UIInput
                    label="Max Mileage"
                    placeholder="200,000+"
                    value={draftFilters.maxMileage}
                    onChangeText={(text) =>
                      updateDraftFilter("maxMileage", text)
                    }
                    containerStyle={styles.halfInput}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.row, { marginBottom: 12 }]}>
                  <View style={styles.halfInput}>
                    <UIPicker
                      label="Fuel Type"
                      values={["Any", ...fuelTypes]}
                      currentPickerValue={draftFilters.fuelType || "Any"}
                      pick={(value) =>
                        updateDraftFilter(
                          "fuelType",
                          value === "Any" ? "" : (value as any),
                        )
                      }
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <UIPicker
                      label="Transmission"
                      values={["Any", ...transmissions]}
                      currentPickerValue={draftFilters.transmission || "Any"}
                      pick={(value) =>
                        updateDraftFilter(
                          "transmission",
                          value === "Any" ? "" : (value as any),
                        )
                      }
                    />
                  </View>
                </View>

                <UIInput
                  label="Location"
                  placeholder="City or Region"
                  value={draftFilters.location}
                  onChangeText={(text) => updateDraftFilter("location", text)}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.actionRow}>
                <UIButton
                  variant="outline"
                  onPress={handleResetFilters}
                  style={styles.resetButton}
                >
                  <UIText weight="bold">Clear All</UIText>
                </UIButton>
                <UIButton
                  variant="primary"
                  onPress={handleChangeFilters}
                  style={styles.applyButton}
                >
                  <UIText color="white" weight="bold">
                    Show Results
                  </UIText>
                </UIButton>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    color: theme.colors.text,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: theme.spacing.lg,
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

  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: Math.max(rt.insets.bottom, 16),
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
}));

