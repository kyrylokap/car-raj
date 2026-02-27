import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSellVehicleForm } from "../hooks/useSellVehicleForm";
import { UIButton, UIInput, UIText } from "../ui";
import { ImagesCarousel } from "../ui/components/ImagesCarousel";
import { UIPicker } from "../ui/UIPicker";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];

export default function SellCarScreen() {
  const { theme, rt } = useUnistyles();
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
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
            { paddingBottom: Math.max(insets.bottom, 16) + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.imagesContainer}>
            <ImagesCarousel
              images={images}
              setImages={setImages}
              handleChangeImagesCount={(newImagesCount) =>
                handleInputChange("images", newImagesCount.toString())
              }
            />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.section}>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Basic Information
              </UIText>
              <UIInput
                label="Brand"
                placeholder="e.g., BMW, Mercedes"
                value={formData.brand}
                onChangeText={(text) => handleInputChange("brand", text)}
                containerStyle={styles.inputSpacing}
              />
              <UIInput
                label="Model"
                placeholder="e.g., C-Class"
                value={formData.model}
                onChangeText={(text) => handleInputChange("model", text)}
                containerStyle={styles.inputSpacing}
              />
              <UIInput
                label="Color"
                placeholder="Black"
                value={formData.color}
                onChangeText={(text) => handleInputChange("color", text)}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Specs & Details
              </UIText>
              <View style={styles.row}>
                <UIInput
                  label="Year"
                  placeholder="2020"
                  value={String(formData.year || "")}
                  onChangeText={(text) => handleInputChange("year", text)}
                  keyboardType="numeric"
                  containerStyle={styles.halfInput}
                />
                <UIInput
                  label="Mileage"
                  placeholder="45000"
                  value={String(formData.mileage || "")}
                  onChangeText={(text) => handleInputChange("mileage", text)}
                  keyboardType="numeric"
                  containerStyle={styles.halfInput}
                />
              </View>

              <View style={[styles.row, { marginBottom: 12 }]}>
                <View style={styles.halfInput}>
                  <UIPicker
                    label="Fuel Type"
                    values={fuelTypes}
                    pick={(value) => handleInputChange("fuel", value)}
                    currentPickerValue={formData.fuel}
                  />
                </View>

                <View style={styles.halfInput}>
                  <UIPicker
                    label="Transmission"
                    values={transmissions}
                    pick={(value) => handleInputChange("transmission", value)}
                    currentPickerValue={formData.transmission}
                  />
                </View>
              </View>

              <UIInput
                label="VIN (Optional)"
                placeholder="Vehicle Identification Number"
                value={formData.vin}
                onChangeText={(text) => handleInputChange("vin", text)}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Pricing & Location
              </UIText>
              <UIInput
                label="Price (PLN)"
                placeholder="125000"
                value={String(formData.price || "")}
                onChangeText={(text) => handleInputChange("price", text)}
                keyboardType="numeric"
                containerStyle={styles.inputSpacing}
              />
              <UIInput
                label="Location"
                placeholder="e.g., Warsaw"
                value={formData.location}
                onChangeText={(text) => handleInputChange("location", text)}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <UIText size="md" weight="semibold" style={styles.sectionTitle}>
                Description
              </UIText>
              <UIInput
                placeholder="Describe your vehicle's condition, features, history, etc."
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline
                style={styles.descriptionInput}
              />

              {Object.entries(errors).some(([_, msg]) => msg !== "") && (
                <View style={styles.errorsContainer}>
                  {Object.entries(errors)
                    .filter(([_, message]) => message !== "")
                    .map(([field, message]) => (
                      <UIText
                        key={field}
                        size="sm"
                        weight="medium"
                        style={styles.errorText}
                      >
                        • {message}
                      </UIText>
                    ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(rt.insets.bottom, 16) },
          ]}
        >
          <View style={styles.actionRow}>
            <UIButton
              variant="outline"
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <UIText weight="bold">Cancel</UIText>
            </UIButton>

            <UIButton
              variant="primary"
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <UIText color="white" weight="bold">
                List vehicle
              </UIText>
            </UIButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    paddingVertical: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  backButton: {
    marginRight: theme.spacing.md,
    width: 32,
  },
  headerTitle: {
    flex: 1,
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 32,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: theme.spacing.md,
  },
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  imagesContainer: {
    marginBottom: theme.spacing.xl,
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
    marginVertical: theme.spacing.xl,
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
    minHeight: theme.vs(120),
    textAlignVertical: "top",
    paddingTop: theme.spacing.md,
  },

  errorsContainer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error + "15",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error + "40",
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 4,
  },

  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
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
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
}));
