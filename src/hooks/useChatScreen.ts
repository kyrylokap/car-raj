import { useState, useRef, useCallback } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../api/auth";
import { useDeleteChat } from "../api/chat";
import useChatMessages from "../api/message";

export function useChatScreen(chatId: string) {
  const router = useRouter();
  const user = useUser();
  const userId = user?.id;
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
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

  const handleSendMessage = async () => {
    if (!inputText.trim() || !userId) return;
    try {
      await sendMessage({ text: inputText });
      setInputText("");
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  const handleChangeInput = (text: string) => {
    setInputText(text);
    sendTyping();
  };

  const handleLeaveChat = useCallback(() => {
    router.back();
    if (messages.length === 0) {
      deleteChat();
      return;
    }
  }, [chatId, messages.length, router, deleteChat]);

  return {
    inputText,
    flatListRef,
    userId,
    messages,
    hasNextPage,
    fetchNextPage,
    isLoadingMessages,
    userTyping,
    handleSendMessage,
    handleChangeInput,
    handleLeaveChat,
  };
}
