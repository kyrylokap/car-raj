import { Database } from "@/src/lib/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./auth";
import { supabase } from "./supabase";
import { fetchUserDetailsByIds } from "./userProfile";

export type Chat = Database["public"]["Tables"]["chat"]["Row"];
export type UserDetailsRow =
  Database["public"]["Tables"]["user_details"]["Row"];

export type ChatWithDetails = Chat & {
  other_details?: UserDetailsRow | null;
  last_message_time?: string | null;
};

export async function getChatsForUser(
  userId: string
): Promise<ChatWithDetails[]> {
  const { data, error } = await supabase
    .from("chat")
    .select("*")
    .or(`owner_id.eq.${userId},customer_id.eq.${userId}`);

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const chatIds = data.map((c) => c.id);

  const { data: lastMessages, error: messagesError } = await supabase
    .from("message")
    .select("chat_id, created_at")
    .in("chat_id", chatIds)
    .order("created_at", { ascending: false });

  if (messagesError) {
    console.error("Error fetching last messages:", messagesError);
  }

  const lastMessageMap: Record<string, string> = {};
  if (lastMessages) {
    const seenChats = new Set<string>();
    for (const msg of lastMessages) {
      if (msg.chat_id && !seenChats.has(msg.chat_id)) {
        lastMessageMap[msg.chat_id] = msg.created_at;
        seenChats.add(msg.chat_id);
      }
    }
  }

  const ids = new Set<string>();
  data.forEach((c) => {
    if (c.owner_id) ids.add(c.owner_id);
    if (c.customer_id) ids.add(c.customer_id);
  });
  const idList = Array.from(ids);

  let detailsMap: Record<string, UserDetailsRow> = {};
  if (idList.length > 0) {
    const detailsData = await fetchUserDetailsByIds(idList);
    detailsData.forEach((d: UserDetailsRow) => {
      detailsMap[d.id] = d;
    });
  }

  const prepared: ChatWithDetails[] = (data || []).map((chat) => ({
    ...chat,
    other_details: ((): UserDetailsRow | null => {
      if (chat.customer_id === userId) {
        return chat.owner_id ? detailsMap[chat.owner_id] ?? null : null;
      }
      return chat.customer_id ? detailsMap[chat.customer_id] ?? null : null;
    })(),
    last_message_time: lastMessageMap[chat.id] || null,
  }));

  prepared.sort((a, b) => {
    const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
    const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
    return timeB - timeA;
  });

  return prepared;
}

export async function getChatsCount(userId: string) {
  const { data, error } = await supabase
    .from("chat")
    .select("*", { count: "exact" })
    .eq("customer_id", userId);
  if (error) throw error;
  return data?.length || 0;
}
export function useChatsCount() {
  const user = useUser();
  const userId = user?.id;
  return useQuery({
    queryKey: ["chatsCount", userId],
    queryFn: async () => {
      if (!userId) return 0;
      return await getChatsCount(userId);
    },
  });
}

export function useUserChats(userId?: string) {
  return useQuery<ChatWithDetails[], Error>({
    queryKey: ["userChats", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getChatsForUser(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
}

export async function getChatById(chatId: string): Promise<Chat | null> {
  const { data, error } = await supabase
    .from("chat")
    .select("*")
    .eq("id", chatId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export type ChatInsert = Database["public"]["Tables"]["chat"]["Insert"];

export async function createChat(chat: ChatInsert): Promise<Chat> {
  const { data, error } = await supabase
    .from("chat")
    .insert(chat)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function findChatBetweenUsersForCar(
  carId: string,
  userA: string,
  userB: string
): Promise<Chat | null> {
  const { data, error } = await supabase
    .from("chat")
    .select("*")
    .eq("car_id", carId);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  const found = data.find((c: Chat) => {
    return (
      (c.owner_id === userA && c.customer_id === userB) ||
      (c.owner_id === userB && c.customer_id === userA)
    );
  });
  return found || null;
}

export async function getOrCreateChatForCar(
  carId: string,
  sellerId: string,
  buyerId: string
): Promise<Chat> {
  const existing = await findChatBetweenUsersForCar(carId, sellerId, buyerId);
  if (existing) return existing;

  const newChat = await createChat({
    car_id: carId,
    owner_id: sellerId,
    customer_id: buyerId,
  });
  return newChat;
}

export const useDeleteChat = ({ chatId }: { chatId: string }) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const userId = user?.id;
  return useMutation({
    mutationKey: ["deleteChat", chatId],
    mutationFn: async () => {
      return await deleteChat(chatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats", userId] });
    },
  });
};

async function deleteChat(chatId: string) {
  const { data, error } = await supabase.from("chat").delete().eq("id", chatId);
  if (error) throw error;
  return data;
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getUserInfo(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export async function getUserById(userId: string) {
  if (!userId) return null;
  const { data, error } = await (supabase as any)
    .from("auth.users")
    .select("id, email, user_metadata")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function getUserDetails(userId: string) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_details")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function getUserInfo(userId: string) {
  if (!userId) return null;
  const details = await getUserDetails(userId);
  return details;
}

export async function getCarTitle(carId: string | null) {
  if (!carId) return null;
  const { data, error } = await supabase
    .from("car")
    .select("brand, model, year")
    .eq("id", carId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const parts = [data.brand, data.model, data.year].filter(Boolean);
  return parts.join(" ");
}

export function useCarTitle(carId?: string | null) {
  return useQuery({
    queryKey: ["carTitle", carId],
    queryFn: async () => {
      if (!carId) return null;
      return await getCarTitle(carId);
    },
    enabled: !!carId,
    staleTime: 1000 * 60 * 20,
  });
}
