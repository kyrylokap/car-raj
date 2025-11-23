import { useUser } from "@/api/auth";
import {
  getChatById,
  useCarTitle,
  useDeleteChat,
  useUserProfile,
} from "@/api/chat";
import useChatMessages, { Message } from "@/api/message";
import { UIText } from "@/ui";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function ChatScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const params = useLocalSearchParams();
  const chatId = params.id as string;
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const user = useUser();
  const userId = user?.id;
  const { mutate: deleteChat, error: deletingError } = useDeleteChat({
    chatId,
  });
  const { data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  const chattingUserId =
    chat?.owner_id === userId ? chat?.customer_id : chat?.owner_id;
  const { data: owner } = useUserProfile(chattingUserId!);
  const { data: carTitle } = useCarTitle(chat?.car_id ?? null);
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
  }, [chatId, messages.length, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleLeaveChat}
          style={styles.backButton}
          hitSlop={14}
        >
          <Ionicons
            hitSlop={14}
            name="arrow-back"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Pressable
          style={styles.headerInfo}
          onPress={() => router.push(`/user/${chattingUserId ?? ""}/user-cars`)}
        >
          <Image
            style={styles.headerAvatar}
            source={{ uri: owner?.image_url! }}
          />

          <View style={styles.headerText}>
            <UIText size="lg">{owner?.fullname || "Owner"}</UIText>
            <UIText size="xs" color="textSecondary">
              {carTitle ?? "—"}
            </UIText>
          </View>
        </Pressable>
        <TouchableOpacity hitSlop={14} style={styles.moreButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageItem item={item} userId={userId!} />
          )}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.8}
        />
        <ActivityIndicator
          animating={isLoadingMessages}
          size={26}
          color={theme.colors.primary}
          style={styles.activityIndicator}
        />
        <View>
          <UIText size="sm" color="primary" style={styles.typingText}>
            {userTyping ? "Typing..." : ""}
          </UIText>

          <View style={styles.inputContainer}>
            <Pressable style={styles.attachButton}>
              <Ionicons name="attach" size={24} color={theme.colors.primary} />
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.textSecondary}
              value={inputText}
              onChangeText={handleChangeInput}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[
                styles.sendButton,
                inputText.trim() && styles.sendButtonActive,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  inputText.trim()
                    ? theme.colors.white
                    : theme.colors.textSecondary
                }
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const MessageItem = ({ item, userId }: { item: Message; userId: string }) => {
  const isOwn = item.sender_id === userId;
  const time = item.created_at
    ? new Date(item.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  return (
    <View
      style={[
        styles.messageContainer,
        isOwn ? styles.messageOwn : styles.messageOther,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther,
        ]}
      >
        <UIText style={[styles.messageText, isOwn && styles.messageTextOwn]}>
          {item.text}
        </UIText>
        <UIText
          size="xxs"
          style={[styles.messageTimestamp, isOwn && styles.messageTimestampOwn]}
        >
          {time}
        </UIText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  activityIndicator: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
  },
  typingText: {
    marginLeft: 16,
    height: 20,
    marginBottom: 2,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  moreButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  messageContainer: {
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
  },
  messageOwn: {
    justifyContent: "flex-end",
  },
  messageOther: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  messageBubbleOwn: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  messageBubbleOther: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  messageText: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  messageTextOwn: {
    color: theme.colors.white,
  },
  messageTimestamp: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    alignSelf: "flex-end",
  },
  messageTimestampOwn: {
    color: theme.colors.white,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.sm,
  },
  attachButton: {
    padding: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    maxHeight: 70,
    color: theme.colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: theme.colors.primary,
  },
}));
