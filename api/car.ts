import { Database } from "@/src/lib/database.types";
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
} | null;

export function useAddCar() {
  const user = useUser();
  return async (car: Car) => {
    if (!user || !car) throw new Error("Not authenticated");
    const carWithUserId = { ...car, user_id: user.id };
    const { data, error } = await supabase.from("car").insert(carWithUserId);

    if (error) throw error;

    return data;
  };
}

export function useUserCars() {
  return async (userId: string) => {
    if (!userId) throw new Error("No user id in useUserCars");

    const { data, error } = await supabase
      .from("car")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return data;
  };
}

export function getCarById() {
  return async (carId: string) => {
    if (!carId) throw new Error("No car id in getCarById");

    const { data, error } = await supabase
      .from("car")
      .select("*")
      .eq("id", carId);

    if (error) throw error;

    return data;
  };
}

export function getCarsRandom() {
  return async () => {
    const { data, error } = await supabase.from("car").select("*");

    if (error) throw error;

    return data;
  };
}
