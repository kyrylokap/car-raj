import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSellVehicleForm } from "../../hooks/useSellVehicleForm";
import { UIButton, UIInput, UIText } from "../../ui";
import { UIAutocompleteInput } from "../UIAutocompleteInput";
import { UIBottomSheet, UIBottomSheetRef } from "../UIBottomSheet";
import { ImagesCarousel } from "../components/ImagesCarousel";
import { Presets } from "react-native-pulsar";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];

interface SellVehicleSheetProps {
  onSuccess?: () => void;
  onDismiss?: () => void;
}

export const SellVehicleSheet = forwardRef<
  UIBottomSheetRef,
  SellVehicleSheetProps
>(({ onSuccess, onDismiss }, ref) => {
  const bottomSheetRef = useRef<UIBottomSheetRef>(null);
  const { theme } = useUnistyles();

  const {
    formData,
    errors,
    images,
    setImages,
    isPending,
    handleInputChange,
    handleSubmit,
  } = useSellVehicleForm();

  useImperativeHandle(ref, () => bottomSheetRef.current!);

  const handleApply = async () => {
    const success = await handleSubmit();
    if (success) {
      Presets.passingCar();
      if (onSuccess) {
        onSuccess();
      }
      bottomSheetRef.current?.dismiss();
    }
  };

  const footer = (
    <View style={styles.actionRow}>
      <UIButton
        variant="ghost"
        style={styles.cancelButton}
        onPress={() => bottomSheetRef.current?.dismiss()}
        disabled={isPending}
      >
        <UIText color="textSecondary" weight="semibold">
          Cancel
        </UIText>
      </UIButton>

      <UIButton
        variant="primary"
        style={styles.submitButton}
        onPress={handleApply}
        loading={isPending}
      >
        <Ionicons name="paper-plane" size={18} color={theme.colors.white} />
        <UIText color="white" weight="bold">
          List vehicle
        </UIText>
      </UIButton>
    </View>
  );

  return (
    <UIBottomSheet
      ref={bottomSheetRef}
      title={
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="car-sport"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <UIText size="xl" weight="bold">
              Sell vehicle
            </UIText>
          </View>
        </View>
      }
      enableDynamicSizing={false}
      snapPoints={["92%"]}
      onDismiss={onDismiss}
      footer={footer}
    >
      <View style={styles.scrollContent}>
        <View style={styles.imagesContainer}>
          <ImagesCarousel
            images={images}
            setImages={setImages}
            onImagesChange={(newCount) =>
              handleInputChange("images", newCount.toString())
            }
          />
          {errors.images && (
            <View style={styles.imageError}>
              <Ionicons name="warning" size={16} color={theme.colors.error} />
              <UIText size="xs" weight="medium" color="error">
                {errors.images}
              </UIText>
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="information-circle"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Basic Information
              </UIText>
            </View>

            <UIAutocompleteInput
              label="Brand"
              placeholder="e.g., BMW"
              value={formData.brand}
              onChangeText={(text) => handleInputChange("brand", text)}
              type="brand"
              containerStyle={styles.inputSpacing}
              errorMessage={errors.brand}
              bottomSheet
            />
            <UIAutocompleteInput
              label="Model"
              placeholder="e.g., 3-Series"
              value={formData.model}
              onChangeText={(text) => handleInputChange("model", text)}
              type="model"
              brandFilter={formData.brand}
              containerStyle={styles.inputSpacing}
              errorMessage={errors.model}
              bottomSheet
            />
            <UIAutocompleteInput
              label="Color"
              placeholder="e.g., Black"
              value={formData.color}
              onChangeText={(text) => handleInputChange("color", text)}
              type="color"
              containerStyle={styles.inputSpacing}
              errorMessage={errors.color}
              bottomSheet
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="options"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Specs & Details
              </UIText>
            </View>

            <View style={styles.row}>
              <UIInput
                label="Year"
                placeholder="2020"
                value={String(formData.year || "")}
                onChangeText={(text) => handleInputChange("year", text)}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
                errorMessage={errors.year}
              />
              <UIInput
                label="Mileage"
                placeholder="45000"
                value={String(formData.mileage || "")}
                onChangeText={(text) => handleInputChange("mileage", text)}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
                errorMessage={errors.mileage}
              />
            </View>

            <View style={[styles.row, { marginBottom: 12 }]}>
              <View style={styles.halfInput}>
                <UIAutocompleteInput
                  label="Fuel Type"
                  placeholder="Select"
                  initialOptions={fuelTypes}
                  value={formData.fuel}
                  onChangeText={(value) => handleInputChange("fuel", value)}
                  errorMessage={errors.fuel}
                  bottomSheet
                />
              </View>

              <View style={styles.halfInput}>
                <UIAutocompleteInput
                  label="Transmission"
                  placeholder="Select"
                  initialOptions={transmissions}
                  value={formData.transmission}
                  onChangeText={(value) =>
                    handleInputChange("transmission", value)
                  }
                  errorMessage={errors.transmission}
                  bottomSheet
                />
              </View>
            </View>

            <UIInput
              label="VIN (Optional)"
              placeholder="Vehicle Identification Number"
              value={formData.vin}
              onChangeText={(text) => handleInputChange("vin", text)}
              errorMessage={errors.vin}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="cash" size={18} color={theme.colors.primary} />
              </View>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Pricing & Location
              </UIText>
            </View>

            <UIInput
              label="Price (PLN)"
              placeholder="125000"
              value={String(formData.price || "")}
              onChangeText={(text) => handleInputChange("price", text)}
              keyboardType="numeric"
              containerStyle={styles.inputSpacing}
              errorMessage={errors.price}
            />
            <UIAutocompleteInput
              label="Location"
              placeholder="e.g., Warsaw"
              value={formData.location}
              onChangeText={(text) => handleInputChange("location", text)}
              type="location"
              errorMessage={errors.location}
              bottomSheet
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="create"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Description
              </UIText>
            </View>

            <UIInput
              placeholder="Describe your vehicle's condition, features, history, etc."
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              multiline
              style={styles.descriptionInput}
              errorMessage={errors.description}
            />

            {Object.entries(errors).length > 0 &&
              Object.entries(errors).some(
                ([k, v]) => v !== "" && k !== "images",
              ) && (
                <View style={styles.errorsContainer}>
                  <View style={styles.errorHeader}>
                    <Ionicons
                      name="alert-circle"
                      size={18}
                      color={theme.colors.error}
                    />
                    <UIText size="sm" weight="semibold" color="error">
                      Some fields need attention
                    </UIText>
                  </View>
                </View>
              )}
          </View>
        </View>
      </View>
    </UIBottomSheet>
  );
});

const styles = StyleSheet.create((theme) => ({
  titleContainer: {
    paddingTop: theme.s(8),
    paddingBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  iconContainer: {
    width: theme.s(36),
    height: theme.s(36),
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  imagesContainer: {
    marginBottom: theme.spacing.xl,
    marginHorizontal: -theme.spacing.lg,
  },
  imageError: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  formContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",

    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  sectionIcon: {
    width: theme.s(28),
    height: theme.s(28),
    borderRadius: theme.borderRadius.sm,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
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
  descriptionInput: {
    minHeight: theme.vs(140),
    textAlignVertical: "top",
    paddingTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  errorsContainer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: `${theme.colors.error}08`,
    borderRadius: theme.borderRadius.xl,
    borderWidth: theme.s(1.5),
    borderColor: `${theme.colors.error}30`,
    gap: theme.spacing.sm,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    paddingLeft: theme.s(4),
  },
  errorIcon: {
    marginTop: theme.s(2),
  },
  errorText: {
    color: theme.colors.error,
    flex: 1,
    lineHeight: theme.vs(20),
  },
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
}));
