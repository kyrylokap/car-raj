import { Database } from "@/src/lib/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

async function uploadCarPhotos(
  userId: string,
  carId: string,
  photos: string[]
) {
  const folderPath = `${userId}$${carId}`;
  console.log(photos);
  const uploads = photos.map(async (uri) => {
    const parts = uri.split("/");
    const fileName = parts[parts.length - 1];
    const file = await fetch(uri).then((res) => res.blob());

    const { data, error } = await supabase.storage
      .from("cars_images")
      .upload(`${folderPath}/${fileName}`, file, { upsert: true });

    if (error) throw error;
    return data;
  });

  return Promise.all(uploads);
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
