import {
  UIButton,
  UICard,
  UIContainer,
  UIInput,
  UIText,
} from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type ListingForm = {
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  fuelType: string;
  location: string;
  description: string;
};

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

export default function CreateListingScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const [formData, setFormData] = useState<ListingForm>({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "",
    location: "",
    description: "",
  });

  const [showFuelTypePicker, setShowFuelTypePicker] = useState(false);

  const handleInputChange = (field: keyof ListingForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Validate form
    if (
      !formData.brand ||
      !formData.model ||
      !formData.year ||
      !formData.price ||
      !formData.mileage ||
      !formData.fuelType ||
      !formData.location
    ) {
      // Show error - in a real app you'd show a toast or alert
      return;
    }

    // Handle form submission
    // In a real app, this would send data to an API
    console.log("Listing created:", formData);

    // Navigate back or to listings
    router.back();
  };

  const isFormValid = () => {
    return (
      formData.brand &&
      formData.model &&
      formData.year &&
      formData.price &&
      formData.mileage &&
      formData.fuelType &&
      formData.location
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <UIText size="xl" weight="bold" style={styles.headerTitle}>
          Create Listing
        </UIText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: rt.insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <UIContainer>
          {/* Image Upload Section */}
          <UICard variant="elevated" style={styles.imageCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Photos
            </UIText>
            <View style={styles.imageUploadContainer}>
              <TouchableOpacity style={styles.imageUploadButton}>
                <Ionicons
                  name="camera"
                  size={32}
                  color={theme.colors.primary}
                />
                <UIText size="sm" color="primary" style={styles.uploadText}>
                  Add Photos
                </UIText>
              </TouchableOpacity>
            </View>
            <UIText size="xs" color="textSecondary" style={styles.hintText}>
              Add at least 3 photos of your vehicle
            </UIText>
          </UICard>

          {/* Basic Information */}
          <UICard variant="elevated" style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Basic Information
            </UIText>

            <UIInput
              label="Brand"
              placeholder="e.g., BMW, Mercedes-Benz"
              value={formData.brand}
              onChangeText={(text) => handleInputChange("brand", text)}
            />

            <UIInput
              label="Model"
              placeholder="e.g., 320d, C-Class"
              value={formData.model}
              onChangeText={(text) => handleInputChange("model", text)}
            />

            <View style={styles.row}>
              <UIInput
                label="Year"
                placeholder="2020"
                value={formData.year}
                onChangeText={(text) => handleInputChange("year", text)}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
              />
              <UIInput
                label="Mileage (km)"
                placeholder="45000"
                value={formData.mileage}
                onChangeText={(text) => handleInputChange("mileage", text)}
                keyboardType="numeric"
                containerStyle={styles.halfInput}
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowFuelTypePicker(!showFuelTypePicker)}
            >
              <View pointerEvents="none">
                <UIInput
                  label="Fuel Type"
                  placeholder="Select fuel type"
                  value={formData.fuelType}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            {showFuelTypePicker && (
              <View style={styles.pickerContainer}>
                {fuelTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.pickerOption,
                      formData.fuelType === type && styles.pickerOptionActive,
                    ]}
                    onPress={() => {
                      handleInputChange("fuelType", type);
                      setShowFuelTypePicker(false);
                    }}
                  >
                    <UIText
                      size="default"
                      color={formData.fuelType === type ? "white" : "text"}
                    >
                      {type}
                    </UIText>
                    {formData.fuelType === type && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={theme.colors.white}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </UICard>

          {/* Pricing & Location */}
          <UICard variant="elevated" style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Pricing & Location
            </UIText>

            <UIInput
              label="Price (PLN)"
              placeholder="125000"
              value={formData.price}
              onChangeText={(text) => handleInputChange("price", text)}
              keyboardType="numeric"
            />

            <UIInput
              label="Location"
              placeholder="e.g., Warsaw, Krakow"
              value={formData.location}
              onChangeText={(text) => handleInputChange("location", text)}
            />
          </UICard>

          {/* Description */}
          <UICard variant="elevated" style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Description
            </UIText>
            <UIInput
              placeholder="Describe your vehicle... (optional)"
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              multiline
              numberOfLines={6}
              style={styles.descriptionInput}
            />
          </UICard>

          {/* Submit Button */}
          <View style={styles.actionButtons}>
            <UIButton
              variant="outline"
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <UIText size="default" weight="semibold">
                Cancel
              </UIText>
            </UIButton>
            <UIButton
              variant="primary"
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={!isFormValid()}
            >
              <UIText size="default" color="white" weight="semibold">
                Create Listing
              </UIText>
            </UIButton>
          </View>
        </UIContainer>
      </ScrollView>
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
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
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
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  imageUploadContainer: {
    marginBottom: theme.spacing.sm,
  },
  imageUploadButton: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  uploadText: {
    marginTop: theme.spacing.xs,
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
    minHeight: 120,
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
