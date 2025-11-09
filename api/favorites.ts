import { supabase } from "@/api/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./auth";
export function useChangeFavorite() {
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: string) => {
      if (!user) throw new Error("Not authenticated");
      return toggleFavorite(carId, user.id);
    },
    onMutate: async (carId: string) => {
      if (!user) return;
      await queryClient.cancelQueries({ queryKey: ["isCarFavorite", carId] });
      const previous = queryClient.getQueryData<boolean>([
        "isCarFavorite",
        carId,
      ]);
      queryClient.setQueryData(["isCarFavorite", carId], !previous);
      return { previous };
    },
    onError: (_err, carId, context) => {
      if (!user) return;
      queryClient.setQueryData(["isCarFavorite", carId], context?.previous);
    },
    onSettled: (_data, _error, carId) => {
      if (!user) return;
      // invalidate queries properly
      queryClient.invalidateQueries({ queryKey: ["userFavorites", user.id] });
      queryClient.invalidateQueries({ queryKey: ["isCarFavorite", carId] });
    },
  });
}

export function useIsCarFavorite(carId: string) {
  const user = useUser();

  return useQuery({
    queryKey: ["isCarFavorite", carId],
    queryFn: async () => {
      if (!user) return false;
      return await isCarFavorite(user.id, carId);
    },
    enabled: !!user,
  });
}

export function useUserFavorites() {
  const user = useUser();

  return useQuery({
    queryKey: ["userFavorites", user?.id!],
    queryFn: async () => {
      if (!user) return [];
      return await getUserFavorites(user.id);
    },
    enabled: !!user,
  });
}

async function isCarFavorite(userId: string, carId: string) {
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("car_id", carId)
    .maybeSingle();

  return !!data;
}

async function getUserFavorites(userId: string) {
  const { data: favoriteCarIds, error: favError } = await supabase
    .from("favorites")
    .select("car_id")
    .eq("user_id", userId);

  if (favError) throw favError;

  if (!favoriteCarIds?.length) return [];

  const carIds = favoriteCarIds.map((row) => row.car_id);

  const { data: cars, error: carsError } = await supabase
    .from("car")
    .select("*")
    .in("id", carIds);

  if (carsError) throw carsError;

  return cars;
}

async function toggleFavorite(carId: string, userId: string) {
  const { data: existed } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("car_id", carId)
    .maybeSingle();
  if (existed) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existed.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, car_id: carId });
    if (error) throw error;
  }
}
