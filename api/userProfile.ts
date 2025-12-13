import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "./auth";
import { UserDetailsRow } from "./chat";
import { supabase } from "./supabase";

async function fetchUserDetailsById(id: string): Promise<UserDetailsRow> {
  const { data, error } = await supabase
    .from("user_details")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export function useUserDetailsById(id: string) {
  return useQuery<UserDetailsRow>({
    queryKey: ["userDetails", id],
    queryFn: async () => {
      return await fetchUserDetailsById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export async function fetchUserDetailsByIds(
  ids: string[]
): Promise<UserDetailsRow[]> {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase
    .from("user_details")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return data || [];
}
export function useUpdatePhoneNumber() {
  const user = useUser();

  return useMutation<UserDetailsRow, unknown, { phone_number: string }>({
    mutationKey: ["userPhoneNumberUpdate", user?.id],
    mutationFn: async ({ phone_number }) => {
      if (!user?.id) throw new Error("User not found");

      const { data, error } = await supabase
        .from("user_details")
        .update({ phone_number })
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useUserPhoneNumber(userId?: string) {
  return useQuery<string | null>({
    queryKey: ["userPhoneNumberGet", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("user_details")
        .select()
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data.phone_number;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}
