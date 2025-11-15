import { Car, useAddCar } from "@/api/car";
import { UIButton, UICard, UIContainer, UIInput, UIText } from "@/ui";
import { ImagesCarousel } from "@/ui/components/ImagesCarousel";
import { UIPicker } from "@/ui/UIPicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import * as z from "zod";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];
const FormData = z.object({
  images: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 4 && num <= 10;
    },
    { message: "*Please, choose between 4-10 images" }
  ),
  brand: z.string().nonempty({ message: "*Please, provide valid brand" }),
  model: z.string().nonempty({ message: "*Please, provide valid model" }),
  year: z
    .string()
    .nonempty({ message: "*Please, provide valid year" })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1990 && num <= new Date().getFullYear();
      },
      { message: "*Year must be a number between 1990 and current year" }
    ),
  price: z
    .string()
    .nonempty({ message: "*Please, provide valid price" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "*Price must be a valid number",
    }),
  mileage: z
    .string()
    .nonempty({ message: "*Please, provide valid mileage" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "*Mileage must be a valid number",
    }),
  fuel: z.enum(fuelTypes),
  location: z.string().min(3, { message: "*Please, provide valid location" }),
  description: z.string().optional().default(""),
  vin: z
    .string()
    .length(17, { message: "*VIN number must contain exactly 17 characters" })
    .regex(/^[A-HJ-NPR-Z0-9]+$/, {
      message: "*Please, provide valid VIN number",
    }),
  transmission: z.enum(transmissions),
  color: z.string().min(2, { message: "*Please, provide valid car color" }),
});

type ListingForm = z.infer<typeof FormData>;

export default function CreateListingScreen() {
  const { theme, rt } = useUnistyles();
  const sellCar = useAddCar();
  const styles = stylesheet;
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState<ListingForm>({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "Petrol",
    location: "",
    description: "",
    vin: "",
    transmission: "Manual",
    color: "",
    images: images.length.toString(),
  });

  const handleInputChange = (field: keyof ListingForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));

    const singleFieldSchema = FormData.pick({ [field]: true });
    const result = singleFieldSchema.safeParse({ [field]: value });

    setErrors((prev) => ({
      ...prev,
      [field]: result.success
        ? ""
        : result.error.flatten().fieldErrors[field]?.[0] || "",
    }));
  };

  const handleSubmit = () => {
    const result = FormData.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const flattened = result.error.flatten().fieldErrors;

      for (const key of Object.keys(flattened)) {
        const messages = flattened[key as keyof typeof flattened];
        if (messages && messages.length > 0) {
          fieldErrors[key] = messages[0];
        }
      }

      setErrors(fieldErrors);
      return;
    }

    if (images.length < 4) {
      setErrors({ images: "Please add at least 4 images" });
      console.log(errors);
      return;
    }

    setErrors({});
    const car: Car = {
      brand: result.data.brand,
      model: result.data.model,
      year: Number(result.data.year),
      price: Number(result.data.price),
      mileage: Number(result.data.mileage),
      fuel: result.data.fuel as Car["fuel"],
      transmission: result.data.transmission as Car["transmission"],
      location: result.data.location,
      description: result.data.description,
      vin: result.data.vin,
      color: result.data.color,
    };

    sellCar.mutate({ car, images });
    router.back();
    Alert.alert("Success", "You added new car to marketplace!", [
      {
        text: "Ok",
        style: "cancel",
      },
    ]);
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
          Sell vehicle
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

const stylesheet = StyleSheet.create((theme) => ({
  errorText: {
    color: "#eb4f4fff",
  },
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
    gap: 10,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  imageUploadButton: {
    padding: 10,
    borderWidth: 2,
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
