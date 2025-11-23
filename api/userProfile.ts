import { useQuery } from "@tanstack/react-query";
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
