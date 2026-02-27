import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { getChatById, useCarTitle, useUserProfile } from "../../api/chat";
import { Message } from "../../api/message";
import { useOnlineUsersContext } from "../../contexts/OnlineUsersContext";
import { useChatScreen } from "../../hooks/useChatScreen";
import { UIText } from "../../ui";

function toGiftedMessage(msg: Message): IMessage {
  return {
    _id: msg.id,
    text: msg.text ?? "",
    createdAt: msg.created_at ? new Date(msg.created_at) : new Date(),
    user: { _id: msg.sender_id ?? "" },
  };
}

export default function ChatScreen() {
  const { theme } = useUnistyles();
  const { isOnlineByUserId } = useOnlineUsersContext();

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const chatId = id as string;

  const {
    userId,
    messages,
    hasNextPage,
    fetchNextPage,
    isLoadingMessages,
    userTyping,
    onSend: onSendAsync,
    onInputTextChanged,
    handleLeaveChat,
  } = useChatScreen(chatId);

  const { data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  const chattingUserId =
    chat?.owner_id === userId ? chat?.customer_id : chat?.owner_id;
  const { data: owner } = useUserProfile(chattingUserId!);
  const { data: carTitle } = useCarTitle(chat?.car_id ?? null);
  const isOnline = chattingUserId ? isOnlineByUserId(chattingUserId) : false;

  const giftedMessages = useMemo(
    () => messages.map(toGiftedMessage),
    [messages],
  );

  const onSend = useCallback(
    (newMessages: IMessage[]) => {
      onSendAsync(newMessages);
    },
    [onSendAsync],
  );

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
            cachePolicy="memory-disk"
            transition={200}
            contentFit="cover"
            priority="high"
          />

          <View style={styles.headerText}>
            <UIText size="lg" numberOfLines={1} ellipsizeMode="tail">
              {owner?.fullname || "Owner"}
            </UIText>
            <View style={styles.subRow}>
              <View
                style={[
                  styles.statusDot,
                  isOnline ? styles.statusDotOnline : styles.statusDotOffline,
                ]}
              />
              <UIText
                size="xs"
                color={isOnline ? "success" : "textSecondary"}
                style={styles.statusText}
                numberOfLines={1}
              >
                {isOnline ? "Online" : "Offline"}
              </UIText>
              <UIText size="xs" color="textSecondary">
                •
              </UIText>
              <UIText
                size="xs"
                color="textSecondary"
                style={styles.carTitleText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {carTitle ?? "—"}
              </UIText>
            </View>
          </View>
        </Pressable>
      </View>

      <View style={[styles.chatContainer, { marginBottom: keyboardHeight }]}>
        <GiftedChat
          messages={giftedMessages}
          onSend={onSend}
          user={{ _id: userId ?? "" }}
          isTyping={userTyping}
          keyboardAvoidingViewProps={{ enabled: false }}
          loadEarlierMessagesProps={{
            isAvailable: hasNextPage ?? false,
            isLoading: isLoadingMessages,
            onPress: () => {
              fetchNextPage();
            },
            isInfiniteScrollEnabled: true,
          }}
          isAvatarOnTop
          isAvatarVisibleForEveryMessage={false}
          renderAvatar={null}
          maxComposerHeight={120}
          timeTextStyle={{
            right: { color: theme.colors.white, opacity: 0.7 },
            left: { color: theme.colors.textSecondary },
          }}
          textInputProps={{
            placeholder: "Type a message...",
            placeholderTextColor: theme.colors.textSecondary,
            onChangeText: onInputTextChanged,
            style: {
              color: theme.colors.text,
              backgroundColor: theme.colors.surface,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: theme.colors.borderLight,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              fontSize: theme.s(15),
              minHeight: theme.vs(44),
            },
          }}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: theme.colors.primary,
                  borderBottomRightRadius: 4,
                },
                left: {
                  backgroundColor: theme.colors.surface,
                  borderBottomLeftRadius: 4,
                },
              }}
              textStyle={{
                right: { color: theme.colors.white },
                left: { color: theme.colors.text },
              }}
            />
          )}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={styles.inputToolbar}
              primaryStyle={styles.inputPrimary}
            />
          )}
          renderSend={(props) => (
            <Send {...props} containerStyle={styles.sendContainer}>
              <View style={styles.sendButton}>
                <Ionicons
                  name="send"
                  size={theme.s(18)}
                  color={theme.colors.white}
                />
              </View>
            </Send>
          )}
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={{ flex: 1 }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    minHeight: theme.vs(70),
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
    width: theme.s(40),
    height: theme.s(40),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  statusDot: {
    width: theme.s(8),
    height: theme.s(8),
    borderRadius: theme.borderRadius.full,
  },
  statusDotOnline: {
    backgroundColor: theme.colors.success,
  },
  statusDotOffline: {
    backgroundColor: theme.colors.border,
  },
  statusText: {
    flexShrink: 0,
  },
  carTitleText: {
    flex: 1,
    minWidth: 0,
  },
  inputToolbar: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.borderLight,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm + rt.insets.bottom,
  },
  inputPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 2,
  },
  sendButton: {
    width: theme.s(44),
    height: theme.s(44),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
}));
