import { Database } from "@/src/lib/database.types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import React from "react";

import mime from "mime";
import { useUser } from "./auth";
import { supabase } from "./supabase";

export type Car = Partial<Database["public"]["Tables"]["car"]["Row"]>;

export type Filter = {
  brand: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  fuelType: Database["public"]["Enums"]["car_fuel_type"] | "";
  location: string;
  minMileage: string;
  maxMileage: string;
  transmission: Database["public"]["Enums"]["car_transmission"] | "";
  sortBy: "price_asc" | "price_desc" | "newest" | "oldest" | "";
};

export const CAR_COLORS = [
  "White",
  "Black",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Brown",
  "Green",
  "Yellow",
  "Beige",
  "Orange",
  "Gold",
  "Purple",
  "Other",
];

export function useCarSuggestions(
  type: "brand" | "model" | "location" | "color",
  query: string,
  brandFilter?: string,
) {
  return useQuery({
    queryKey: ["suggestions", type, query, brandFilter],
    queryFn: async () => {
      if (!query && type !== "color") return [];

      if (type === "brand") {
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`,
        );
        const json = await response.json();
        const results = (json.Results || [])
          .map((item: any) => item.MakeName)
          .filter((name: string) =>
            name.toLowerCase().includes(query.toLowerCase()),
          );
        return Array.from(new Set(results)).sort().slice(0, 15);
      }

      if (type === "model" && brandFilter) {
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brandFilter}?format=json`,
        );
        const json = await response.json();
        const results = (json.Results || [])
          .map((item: any) => item.Model_Name)
          .filter((name: string) =>
            name.toLowerCase().includes(query.toLowerCase()),
          );
        return Array.from(new Set(results)).sort().slice(0, 15);
      }

      if (type === "color") {
        return CAR_COLORS.filter((c) =>
          c.toLowerCase().includes(query.toLowerCase()),
        );
      }

      // Fallback to supabase for location or other types
      let supabaseQuery = supabase
        .from("car")
        .select(type)
        .ilike(type as any, `%${query}%`)
        .limit(20);

      const { data, error } = await supabaseQuery;
      if (error) throw error;

      const values = data
        .map((item: any) => item[type])
        .filter((v): v is string => !!v);
      return Array.from(new Set(values)).sort();
    },
    enabled: type === "color" || query.length > 0,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour as brands don't change often
  });
}

export function useCarSuggestionsFormatted(
  type: "brand" | "model" | "location" | "color",
  query: string,
  brandFilter?: string,
) {
  const { data = [], isLoading } = useCarSuggestions(type, query, brandFilter);
  return React.useMemo(
    () => ({
      data: data.map((item) => ({ id: item, title: item })),
      isLoading,
    }),
    [data, isLoading],
  );
}

export function useSearchCarWithFilters(filters?: Filter) {
  return useQuery({
    queryKey: ["searchCars", filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_cars", {
        p_filters: filters || {},
        p_limit: 1000,
        p_offset: 0,
      });

      if (error) throw error;
      return (data || []) as Car[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export async function fetchCarsPage(filters?: Filter, limit = 5, offset = 0) {
  const { data, error } = await supabase.rpc("search_cars", {
    p_filters: filters || {},
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("Error fetching cars via RPC:", error);
    throw error;
  }

  return (data || []) as Car[];
}

export function useInfiniteSearchCars(filters?: Filter, pageSize = 5) {
  return useInfiniteQuery<Car[], Error>({
    queryKey: ["infiniteSearchCars", filters, pageSize],
    queryFn: async ({ pageParam = 0 }): Promise<Car[]> => {
      const page = await fetchCarsPage(filters, pageSize, pageParam as number);
      return page;
    },
    getNextPageParam: (lastPage: Car[] | undefined, pages: Car[][]) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return pages.length * pageSize;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
}
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
      queryClient.invalidateQueries({ queryKey: ["carsCount", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["infiniteSearchCars"] });
      queryClient.invalidateQueries({ queryKey: ["searchCars"] });
    },
  });
}

export function useUserCarsCount() {
  const user = useUser();

  return useQuery({
    queryKey: ["carsCount", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      return await getUserCarsCount(user.id);
    },
    staleTime: 1000 * 60 * 24,
  });
}
async function getUserCarsCount(userId: string) {
  const { count, error } = await supabase
    .from("car")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (error) throw error;

  return count || 0;
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
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}
async function insertCar(car: Car, userId: string) {
  const carWithUserId = { ...car, user_id: userId };

  const { data, error } = await supabase
    .from("car")
    .insert(carWithUserId as Database["public"]["Tables"]["car"]["Insert"])
    .select();

  if (error) throw error;

  if (!data || data.length === 0) throw new Error("Car not inserted");

  return data[0];
}

async function uploadCarImages(
  userId: string,
  carId: string,
  photos: string[],
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
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 24,
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

  const paths = files
    .map((f) => f?.name)
    .filter((name): name is string => !!name)
    .map((name) => `${folderPath}/${name}`);

  if (paths.length === 0) return [];

  const { data: signed, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, 60 * 60 * 24 * 7);

  if (signedError) throw signedError;

  return (signed ?? [])
    .map((x) => x?.signedUrl)
    .filter((u): u is string => !!u);
}

async function getCarFirstImageUrl({
  userId,
  carId,
}: {
  userId: string;
  carId: string;
}): Promise<string | null> {
  if (!userId || !carId) return null;

  const folderPath = `${userId}/${carId}`;
  const bucket = "cars_images";

  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(folderPath, { limit: 1, offset: 0 });

  if (listError) throw listError;
  const firstName = files?.[0]?.name;
  if (!firstName) return null;

  const path = `${folderPath}/${firstName}`;
  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  if (signedError) throw signedError;
  return signedData?.signedUrl ?? null;
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
      return await getCarFirstImageUrl({ userId, carId });
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
