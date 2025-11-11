import { Database } from "@/src/lib/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
};
export function useAddCar() {
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ car, photos }: { car: Car; photos: string[] }) => {
      if (!user) throw new Error("Not authenticated");

      const newCar = await insertCar(car, user.id);

      await uploadCarPhotos(user.id, newCar.id, photos);
      return newCar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["userCars", user?.id] });
    },
  });
}
export function useCarPhotos({
  userId,
  carId,
}: {
  userId: string;
  carId: string;
}) {
  return useQuery({
    queryKey: ["useCarPhotos", userId, carId],
    queryFn: async () => {
      return await getCarPhotos({ userId, carId });
    },
  });
}

async function getCarPhotos({
  userId,
  carId,
}: {
  userId: string;
  carId: string;
}) {
  if (!userId || !carId) throw new Error("No ids in getCarPhotos");

  const folderPath = `${userId}/${carId}`; // matches your upload path prefix
  const bucket = "cars_images"; // adjust if your bucket name differs

  // list files in the folder (increase limit if you expect >1000 files)
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(folderPath, { limit: 1000, offset: 0 });

  if (listError) throw listError;
  if (!files || files.length === 0) return [];

  // For each file, return metadata + URL. Use signed URLs for private buckets.
  const results = await Promise.all(
    files.map(async (f) => {
      const path = `${folderPath}/${f.name}`;

      // Try getPublicUrl first (works for public buckets)
      try {
        const publicRes = supabase.storage.from(bucket).getPublicUrl(path);
        // supabase-js returns { data: { publicUrl } } or { publicUrl } depending on version
        const publicUrl = publicRes?.data?.publicUrl ?? null;
        if (publicUrl) return { ...f, url: publicUrl, path };
      } catch (_) {
        // ignore and fallback to signed url
      }

      // Fallback: create a signed URL (valid temporarily). Adjust expiresIn as required.
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60); // 1 hour

      if (signedError) {
        console.error("Failed to create signed URL for", path, signedError);
        return { ...f, url: null, path };
      }

      return { ...f, url: signedData?.signedUrl ?? null, path };
    })
  );

  return results;
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

async function uploadCarPhotos(
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

      const ext = fileName.split(".").pop();
      const contentType = ext
        ? mime.getType(ext) || "image/jpeg"
        : "image/jpeg";

      const dataUrl = `data:${contentType};base64,${base64}`;

      const filePath = `${folderPath}/${fileName}`;
      const { data, error } = await supabase.storage
        .from("cars_images")
        .upload(filePath, dataUrl, {
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
