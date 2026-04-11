import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import * as z from "zod";
import { Car, useAddCar } from "../api/car";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];
const transmissions = ["Manual", "Automatic", "Cvt", "Semi-automatic"];

export const FormDataSchema = z.object({
  images: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 4 && num <= 10;
    },
    { message: "*Please, choose between 4-10 images" },
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
      { message: "*Year must be a number between 1990 and current year" },
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
  fuel: z.enum(fuelTypes as [string, ...string[]]),
  location: z.string().min(3, { message: "*Please, provide valid location" }),
  description: z.string().optional().default(""),
  vin: z
    .string()
    .length(17, { message: "*VIN number must contain exactly 17 characters" })
    .regex(/^[A-HJ-NPR-Z0-9]+$/, {
      message: "*Please, provide valid VIN number",
    }),
  transmission: z.enum(transmissions as [string, ...string[]]),
  color: z.string().min(2, { message: "*Please, provide valid car color" }),
});

export type ListingForm = z.infer<typeof FormDataSchema>;

const defaultFormData: ListingForm = {
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
  images: "0",
};

export function useSellVehicleForm() {
  const router = useRouter();
  const sellCar = useAddCar();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<ListingForm>({
    ...defaultFormData,
    images: "0",
  });

  const handleInputChange = (field: keyof ListingForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));

    const singleFieldSchema = FormDataSchema.pick({ [field]: true });
    const result = singleFieldSchema.safeParse({ [field]: value });

    setErrors((prev) => ({
      ...prev,
      [field]: result.success
        ? ""
        : result.error.flatten().fieldErrors[field]?.[0] || "",
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    const result = FormDataSchema.safeParse(formData);

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
      return false;
    }

    if (images.length < 4) {
      setErrors({ images: "Please add at least 4 images" });
      return false;
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

    try {
      await sellCar.mutateAsync({ car, images });
      Alert.alert("Success", "You added new car to marketplace!", [
        {
          text: "Ok",
          style: "cancel",
        },
      ]);
      return true;
    } catch (error) {
      console.error("Error adding car:", error);
      Alert.alert("Error", "Failed to add car. Please try again.");
      return false;
    }
  };

  return {
    formData,
    errors,
    images,
    setImages,
    isPending: sellCar.isPending,
    handleInputChange,
    handleSubmit,
  };
}
