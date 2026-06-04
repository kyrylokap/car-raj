import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import * as Haptics from "expo-haptics";
import { StyleSheet } from "react-native-unistyles";
import { getChatById, useCarTitle, useUserProfile } from "../../api/chat";
import { useOnlineUsersContext } from "../../contexts/OnlineUsersContext";
import { useChatScreen } from "../../hooks/useChatScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UIText } from "@/src/ui";
import { Message } from "@/src/api/message";

function toGiftedMessage(msg: Message): IMessage {
  return {
    _id: msg.id,
    text: msg.text ?? "",
    createdAt: msg.created_at ? new Date(msg.created_at) : new Date(),
    user: { _id: msg.sender_id ?? "" },
  };
}

export default function ChatScreen() {
  const { isOnlineByUserId } = useOnlineUsersContext();

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const chatId = id as string;
  const { top } = useSafeAreaInsets();
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

  const chattingUserId = useMemo(() => {
    if (!chat || !userId) return null;
    return chat.owner_id === userId ? chat.customer_id : chat.owner_id;
  }, [chat, userId]);

  const isOnline = useMemo(() => {
    if (!chattingUserId) return false;
    return isOnlineByUserId(chattingUserId);
  }, [chattingUserId, isOnlineByUserId]);

  const showStatus = !!chat;

  const { data: owner } = useUserProfile(chattingUserId!);
  const { data: carTitle } = useCarTitle(chat?.car_id ?? null);

  const giftedMessages = useMemo(
    () => messages.map(toGiftedMessage),
    [messages],
  );

  const onSend = useCallback(
    (newMessages: IMessage[]) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSendAsync(newMessages);
    },
    [onSendAsync],
  );

  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <View style={styles.container}>
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleLeaveChat();
          }}
          style={styles.backButton}
          hitSlop={14}
        >
          <Ionicons
            hitSlop={14}
            name="arrow-back"
            size={24}
            color={styles.headerIcon.color}
          />
        </TouchableOpacity>
        <Pressable
          style={styles.headerInfo}
          onPress={() => {
            Haptics.selectionAsync();
            router.push(`/user/${chattingUserId ?? ""}/user-cars`);
          }}
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
              {owner?.fullname || (chattingUserId ? "Loading..." : "User")}
            </UIText>
            {showStatus && (
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
            )}
          </View>
        </Pressable>
      </View>

      <GiftedChat
        messages={giftedMessages}
        onSend={onSend}
        user={{ _id: userId ?? "" }}
        isTyping={userTyping}
        keyboardAvoidingViewProps={{
          keyboardVerticalOffset: headerHeight + top,
        }}
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
        timeTextStyle={{
          right: { color: styles.chatTime.color, opacity: 0.7 },
          left: { color: styles.chatTimeLeft.color },
        }}
        textInputProps={{
          placeholder: "Type a message...",
          placeholderTextColor: styles.textInputPlaceholder.color,
          onChangeText: onInputTextChanged,
          style: {
            color: styles.textInput.color,
            backgroundColor: styles.textInput.backgroundColor,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: styles.textInput.borderColor,
            paddingHorizontal: styles.textInput.paddingHorizontal,
            fontSize: styles.textInput.fontSize,
            maxHeight: 120,
          },
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: styles.bubbleRight.backgroundColor,
                borderBottomRightRadius: 4,
              },
              left: {
                backgroundColor: styles.bubbleLeft.backgroundColor,
                borderBottomLeftRadius: 4,
              },
            }}
            textStyle={{
              right: { color: styles.bubbleRight.color },
              left: { color: styles.bubbleLeft.color },
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
                size={styles.sendIcon.size}
                color={styles.sendIcon.color}
              />
            </View>
          </Send>
        )}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color={styles.loader.color}
            style={{ flex: 1 }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  headerIcon: {
    color: theme.colors.text,
  },
  chatTime: {
    color: theme.colors.white,
  },
  chatTimeLeft: {
    color: theme.colors.textSecondary,
  },
  textInputPlaceholder: {
    color: theme.colors.textSecondary,
  },
  sendIcon: {
    color: theme.colors.white,
    size: theme.s(18),
  },
  textInput: {
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.s(15),
  },
  bubbleRight: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
  },
  bubbleLeft: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  loader: {
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: rt.insets.bottom,
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
  header: {
    paddingTop: rt.insets.top,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
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
  },
}));
