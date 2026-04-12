import { Database } from "@/src/lib/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useUser } from "./auth";
import { supabase } from "./supabase";
import { fetchUserDetailsByIds } from "./userProfile";

export type Chat = Database["public"]["Tables"]["chat"]["Row"];
export type MessageRow = Database["public"]["Tables"]["message"]["Row"];
export type UserDetailsRow =
  Database["public"]["Tables"]["user_details"]["Row"];

export type LastMessagePreview = Pick<
  MessageRow,
  "id" | "text" | "created_at" | "sender_id" | "chat_id"
>;

export type ChatWithDetails = Chat & {
  other_details?: UserDetailsRow | null;
  last_message?: LastMessagePreview | null;
  last_message_time?: string | null;
  last_message_text?: string | null;
  last_message_sender_id?: string | null;
};

export async function getChatsForUser(
  userId: string,
): Promise<ChatWithDetails[]> {
  const { data, error } = await supabase
    .from("chat")
    .select(
      `
      *,
      last_message:message!message_chat_id_fkey (
        id,
        chat_id,
        text,
        created_at,
        sender_id
      )
    `,
    )
    .order("created_at", { foreignTable: "message", ascending: false })
    .limit(1, { foreignTable: "message" })
    .or(`owner_id.eq.${userId},customer_id.eq.${userId}`);

  if (error) throw error;
  if (!data || data.length === 0) return [];

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

  const prepared: ChatWithDetails[] = (data || []).map((chat: any) => {
    const embeddedLastMessage: LastMessagePreview | null =
      Array.isArray(chat?.last_message) && chat.last_message.length > 0
        ? chat.last_message[0]
        : null;

    return {
      ...chat,
      last_message: embeddedLastMessage,
      other_details: ((): UserDetailsRow | null => {
        if (chat.customer_id === userId) {
          return chat.owner_id ? (detailsMap[chat.owner_id] ?? null) : null;
        }
        return chat.customer_id ? (detailsMap[chat.customer_id] ?? null) : null;
      })(),
      last_message_time: embeddedLastMessage?.created_at ?? null,
      last_message_text: embeddedLastMessage?.text ?? null,
      last_message_sender_id: embeddedLastMessage?.sender_id ?? null,
    };
  });

  prepared.sort((a, b) => {
    const timeA = a.last_message_time
      ? new Date(a.last_message_time).getTime()
      : 0;
    const timeB = b.last_message_time
      ? new Date(b.last_message_time).getTime()
      : 0;
    return timeB - timeA;
  });

  return prepared;
}

export function useUserChats(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<ChatWithDetails[], Error>({
    queryKey: ["userChats", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getChatsForUser(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });

  const chatIdsKey = useMemo(() => {
    const ids = (query.data ?? []).map((c) => c.id).sort();
    return ids.join("|");
  }, [query.data]);

  useEffect(() => {
    if (!userId) return;

    // 1. Listen for new chats or chat deletions
    const globalChatChannel = supabase
      .channel(`user:${userId}:chats-sync`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `owner_id=eq.${userId}`,
        },
        () => query.refetch(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `customer_id=eq.${userId}`,
        },
        () => query.refetch(),
      )
      .subscribe();

    // 2. Setup listeners for messages in existing chats to update "last message"
    const chats = queryClient.getQueryData<ChatWithDetails[]>([
      "userChats",
      userId,
    ]);
    const chatIds = (chats ?? []).map((c) => c.id);

    const channels = chatIds.map((chatId) => {
      const channel = supabase.channel(`chat:${chatId}:last_message`);

      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMsg: any = payload.new;

          queryClient.setQueryData<ChatWithDetails[]>(
            ["userChats", userId],
            (prev) => {
              if (!prev) return prev;
              const idx = prev.findIndex((c) => c.id === newMsg.chat_id);
              if (idx === -1) return prev;

              const updated = [...prev];
              const old = updated[idx];

              const lastMessage: LastMessagePreview = {
                id: newMsg.id,
                chat_id: newMsg.chat_id,
                text: newMsg.text,
                created_at: newMsg.created_at,
                sender_id: newMsg.sender_id,
              };

              updated[idx] = {
                ...old,
                last_message: lastMessage,
                last_message_time: newMsg.created_at ?? old.last_message_time,
                last_message_text: newMsg.text ?? old.last_message_text,
                last_message_sender_id:
                  newMsg.sender_id ?? old.last_message_sender_id,
              };

              updated.sort((a, b) => {
                const timeA = a.last_message_time
                  ? new Date(a.last_message_time).getTime()
                  : 0;
                const timeB = b.last_message_time
                  ? new Date(b.last_message_time).getTime()
                  : 0;
                return timeB - timeA;
              });

              return updated;
            },
          );
        },
      );

      channel.subscribe();
      return channel;
    });

    return () => {
      supabase.removeChannel(globalChatChannel);
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [userId, chatIdsKey, queryClient]);

  return query;
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
  userB: string,
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
  buyerId: string,
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
