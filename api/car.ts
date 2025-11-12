import { Database } from "@/src/lib/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer"; // npm install base64-arraybuffer
import * as FileSystem from "expo-file-system/legacy";

import mime from "mime"; // if not available, map extensions manually
import { useUser } from "./auth";
import { supabase } from "./supabase";

export type Car = {
  brand: string;
  color?: string | null;
  created_at?: string;
  description?: string | null;
  fuel?: Database["public"]["Enums"]["car_fuel_type"] | null;
  id?: string;
  location?: string | null;
  mileage?: number | null;
  model: string;
  price?: number | null;
  status?: Database["public"]["Enums"]["car_status"] | null;
  transmission?: Database["public"]["Enums"]["car_transmission"] | null;
  vin?: string | null;
  year?: number | null;
  user_id?: string;
};
export function useAddCar() {
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ car, images }: { car: Car; images: string[] }) => {
      if (!user) throw new Error("Not authenticated");

      const newCar = await insertCar(car, user.id);

      await uploadCarImages(user.id, newCar.id, images);
      return newCar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["userCars", user?.id] });
    },
  });
}

export function useUserCars(userId: string) {
  return useQuery({
    queryKey: ["userCars", userId],
    queryFn: async () => {
      return await getUserCarsById(userId);
    },
  });
}

export function useCarById(carId: string) {
  return useQuery({
    queryKey: ["carId", carId],
    queryFn: async () => {
      return await getCarById(carId);
    },
    staleTime: 1000 * 60 * 24,
  });
}

async function getCarsRandom() {
  const { data, error } = await supabase.from("car").select("*");

  if (error) throw error;

  return data;
}

export function useCarsRandom() {
  return useQuery({
    queryKey: ["carsRandom"],
    queryFn: async () => {
      return await getCarsRandom();
    },
  });
}

async function getCarById(carId: string) {
  if (!carId) throw new Error("No car id in getCarById");

  const { data, error } = await supabase
    .from("car")
    .select("*")
    .eq("id", carId)
    .single();

  if (error) throw error;

  return data;
}
async function getUserCarsById(userId: string) {
  if (!userId) throw new Error("No user id in getUserCarsById");

  const { data, error } = await supabase
    .from("car")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data;
}
async function insertCar(car: Car, userId: string) {
  const carWithUserId = { ...car, user_id: userId };

  const { data, error } = await supabase
    .from("car")
    .insert(carWithUserId)
    .select();

  if (error) throw error;

  if (!data || data.length === 0) throw new Error("Car not inserted");

  return data[0];
}

async function uploadCarImages(
  userId: string,
  carId: string,
  photos: string[]
) {
  const folderPath = `${userId}/${carId}`;

  const uploads = photos.map(async (uri: string) => {
    try {
      const parts = uri.split("/");
      const fileName = `${Date.now()}_${parts[parts.length - 1]}`;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBuffer = decode(base64);

      const ext = fileName.split(".").pop();
      const contentType = ext
        ? mime.getType(ext) || "image/jpeg"
        : "image/jpeg";

      const filePath = `${folderPath}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("cars_images")
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        console.error("Upload error", error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Upload failed for", uri, err);
      throw err;
    }
  });

  return Promise.all(uploads);
}

export function useCarImages({
  userId,
  carId,
}: {
  userId: string;
  carId: string;
}) {
  return useQuery({
    queryKey: ["useCarPhotos", userId, carId],
    queryFn: async () => {
      return await getCarImages({ userId, carId });
    },
    enabled: userId !== undefined && carId !== undefined,
    staleTime: 1000 * 60 * 5,
  });
}

async function getCarImages({
  userId,
  carId,
}: {
  userId: string;
  carId: string;
}): Promise<string[]> {
  if (!userId || !carId) {
    throw new Error("No ids in getCarImages");
  }

  const folderPath = `${userId}/${carId}`;
  const bucket = "cars_images";

  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(folderPath, { limit: 1000, offset: 0 });

  if (listError) {
    throw listError;
  }

  if (!files || files.length === 0) {
    return [];
  }

  const urls: string[] = [];

  for (const f of files) {
    const path = `${folderPath}/${f.name}`;
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60);

    if (signedError) {
      console.error("Failed to create signed URL for", path, signedError);
      continue;
    }

    if (signedData && signedData.signedUrl) {
      urls.push(signedData.signedUrl);
    }
  }

  return urls;
}
export function useCarFirstImage({
  userId,
  carId,
}: {
  userId: string;
  carId: string;
}) {
  return useQuery<string | null>({
    queryKey: ["useCarFirstImage", userId, carId],
    queryFn: async () => {
      const images = await getCarImages({ userId, carId });
      return images.length > 0 ? images[0] : null;
    },
    staleTime: 1000 * 60 * 5,
  });
}
