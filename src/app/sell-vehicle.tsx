import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSellVehicleForm } from "../hooks/useSellVehicleForm";
import { UIButton, UICard, UIContainer, UIInput, UIText } from "../ui";
import { ImagesCarousel } from "../ui/components/ImagesCarousel";
import { UIPicker } from "../ui/UIPicker";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];

export default function SellCarScreen() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    formData,
    errors,
    images,
    setImages,
    handleInputChange,
    handleSubmit,
  } = useSellVehicleForm();

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={[styles.header]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={14}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <UIText size="xl" weight="bold" style={styles.headerTitle}>
          Sell vehicle
        </UIText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <UIContainer>
          <ImagesCarousel
            images={images}
            setImages={setImages}
            handleChangeImagesCount={(newImagesCount) =>
              handleInputChange("images", newImagesCount.toString())
            }
          />
          <UICard style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Basic Information
            </UIText>

            <UIInput
              label="Brand"
              placeholder="e.g., BMW"
              value={formData.brand}
              onChangeText={(text) => handleInputChange("brand", text)}
            />

            <UIInput
              label="Model"
              placeholder="e.g., C-Class"
              value={formData.model}
              onChangeText={(text) => handleInputChange("model", text)}
            />

            <View style={styles.row}>
              <UIInput
                label="Year"
                placeholder="2020"
                value={String(formData.year)}
                onChangeText={(text) => handleInputChange("year", text)}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
              />
              <UIInput
                label="Mileage"
                placeholder="45000"
                value={String(formData.mileage)}
                onChangeText={(text) => handleInputChange("mileage", text)}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
              />
            </View>

            <UIInput
              label="Color"
              placeholder="Black"
              value={formData.color}
              onChangeText={(text) => handleInputChange("color", text)}
            />
            <View style={styles.row}>
              <UIPicker
                label="Fuel Type"
                values={fuelTypes}
                pick={(value) => {
                  handleInputChange("fuel", value);
                }}
                currentPickerValue={formData.fuel}
              />

              <UIPicker
                label="Transmission"
                values={transmissions}
                pick={(value) => {
                  handleInputChange("transmission", value);
                }}
                currentPickerValue={formData.transmission}
              />
            </View>

            <UIInput
              label="VIN"
              placeholder="Vehicle Identification Number"
              value={formData.vin}
              onChangeText={(text) => handleInputChange("vin", text)}
            />
          </UICard>

          <UICard style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Pricing & Location
            </UIText>

            <UIInput
              label="Price (PLN)"
              placeholder="125000"
              value={String(formData.price)}
              onChangeText={(text) => handleInputChange("price", text)}
              keyboardType="numeric"
            />

            <UIInput
              label="Location"
              placeholder="e.g., Warsaw"
              value={formData.location}
              onChangeText={(text) => handleInputChange("location", text)}
            />
          </UICard>

          <UICard style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Description
            </UIText>
            <UIInput
              placeholder="Describe your vehicle..."
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              multiline
              numberOfLines={6}
              style={styles.descriptionInput}
            />
            <UICard style={styles.formCard}>
              {Object.entries(errors)
                .filter(([_, message]) => message != "")
                .map(([field, message]) => (
                  <UIText key={field} style={styles.errorText}>
                    {message}
                  </UIText>
                ))}
            </UICard>
          </UICard>

          <View style={styles.actionButtons}>
            <UIButton
              variant="outline"
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <UIText weight="semibold">Cancel</UIText>
            </UIButton>

            <UIButton
              variant="primary"
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <UIText color="white" weight="semibold">
                Sell vehicle
              </UIText>
            </UIButton>
          </View>
        </UIContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  errorText: {
    color: "#eb4f4fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  headerRight: {
    width: theme.scale(40),
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    gap: theme.scale(10),
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  imageUploadButton: {
    padding: theme.scale(10),
    borderWidth: theme.scale(2),
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    marginTop: theme.spacing.xs,
  },
  formCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  halfInput: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  pickerContainer: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  pickerOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  descriptionInput: {
    minHeight: theme.verticalScale(120),
    textAlignVertical: "top",
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
}));
