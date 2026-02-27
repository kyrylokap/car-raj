import { useRouter } from "expo-router";
import { useCallback } from "react";
import { IMessage } from "react-native-gifted-chat";
import { useUser } from "../api/auth";
import { useDeleteChat } from "../api/chat";
import useChatMessages from "../api/message";

export function useChatScreen(chatId: string) {
  const router = useRouter();
  const user = useUser();
  const userId = user?.id;
  const { mutate: deleteChat } = useDeleteChat({ chatId });

  const {
    messages,
    sendMessage,
    hasNextPage,
    fetchNextPage,
    isLoadingMessages,
    sendTyping,
    userTyping,
  } = useChatMessages({ chatId });

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (!userId) return;
      const text = newMessages[0]?.text;
      if (!text || !text.trim()) return;

      try {
        await sendMessage({ text });
      } catch (err) {
        console.error("Send failed", err);
      }
    },
    [sendMessage, userId],
  );

  const onInputTextChanged = (text: string) => {
    sendTyping();
  };

  const handleLeaveChat = useCallback(() => {
    router.back();
    if (messages.length === 0) {
      deleteChat();
    }
  }, [chatId, messages.length, router, deleteChat]);

  return {
    userId,
    messages,
    hasNextPage,
    fetchNextPage,
    isLoadingMessages,
    userTyping,
    onSend,
    onInputTextChanged,
    handleLeaveChat,
  };
}
