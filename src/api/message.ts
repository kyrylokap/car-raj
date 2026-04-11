import { Database } from "@/src/lib/database.types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useUser } from "./auth";
import { db } from "./firebase";
import { supabase } from "./supabase";
export type Message = Database["public"]["Tables"]["message"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["message"]["Insert"];

export async function fetchMessagesPage(
  limit = 15,
  offset = 0,
  chatId?: string | null
): Promise<Message[]> {
  let query = supabase
    .from("message")
    .select("*")
    .order("created_at", { ascending: false });
  if (chatId) {
    query = query.eq("chat_id", chatId);
  }
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export function useInfiniteMessages(pageSize = 15, chatId?: string | null) {
  return useInfiniteQuery<Message[], Error>({
    queryKey: ["messages", chatId ?? null],
    queryFn: async ({ pageParam = 0 }) => {
      const page = await fetchMessagesPage(
        pageSize,
        pageParam as number,
        chatId
      );
      return page;
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return pages.length * pageSize;
    },
    initialPageParam: 0,
    enabled: !!chatId,
  });
}

export default function useChatMessages({ chatId }: { chatId: string }) {
  const queryClient = useQueryClient();
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isLoading: isMessagesLoading,
    isFetchingNextPage: isFetchingNextMessagesPage,
  } = useInfiniteMessages(15, chatId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel>(null);
  const user = useUser();
  const userId = user?.id;
  useEffect(() => {
    if (!messagesData) return;
    const allMessages = messagesData.pages.flat();
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg.id, msg])).values()
    );
    setMessages(uniqueMessages);
  }, [messagesData]);

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase.channel(`chat:${chatId}:message`, {
      config: {
        broadcast: { self: false },
      },
    });

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "message",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        const newMsg = payload.new;
        const preparedMessage: Message = {
          chat_id: newMsg.chat_id,
          created_at: newMsg.created_at,
          id: newMsg.id,
          sender_id: newMsg.sender_id,
          text: newMsg.text,
        };

        setMessages((prev) => [preparedMessage, ...prev]);
      }
    );

    channel.on("broadcast", { event: "user_typing" }, ({ payload }) => {
      const typingUserId = payload?.userId;
      if (!typingUserId || typingUserId === userId) return;

      setTypingUsers((prev) => Array.from(new Set([...prev, typingUserId])));
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((id) => id !== typingUserId));
      }, 1500);
    });

    channel.subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const sendTyping = () => {
    if (!channelRef.current || !userId) return;
    channelRef.current.send({
      type: "broadcast",
      event: "user_typing",
      payload: { userId },
    });
  };

  const sendMessage = async ({ text }: { text: string }) => {
    const { data, error } = await supabase
      .from("message")
      .insert([{ text, sender_id: userId, chat_id: chatId }])
      .select()
      .single();

    if (error) {
      console.error("insert message error", error);
      throw error;
    }

    await sendMessageFirebase({ text, message_id: data?.id! });

    return data;
  };

  const sendMessageFirebase = async ({
    text,
    message_id,
  }: {
    text: string;
    message_id: string;
  }) => {
    const data = await addDoc(collection(db, "messages"), {
      id: message_id,
      chat_id: chatId,
      text,
      sender_id: userId,
      created_at: serverTimestamp(),
    });
  };
  return {
    messages,
    sendMessage,
    fetchNextPage,
    hasNextPage,
    sendTyping,
    userTyping: typingUsers.find((id) => id !== userId) !== undefined,
    isLoadingMessages: isMessagesLoading || isFetchingNextMessagesPage,
  };
}
