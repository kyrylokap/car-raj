import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { getChatById, useCarTitle, useUserProfile } from "../../api/chat";
import { Message } from "../../api/message";
import { useChatScreen } from "../../hooks/useChatScreen";
import { UIInput, UIText } from "../../ui";

export default function ChatScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const params = useLocalSearchParams();
  const chatId = params.id as string;
  const [inputHeight, setInputHeight] = React.useState(theme.verticalScale(56));

  const {
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
  } = useChatScreen(chatId);

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const minHeight = theme.verticalScale(56);
    const maxHeight = theme.verticalScale(120);
    const newHeight = Math.min(
      Math.max(height + theme.spacing.md * 2, minHeight),
      maxHeight,
    );
    setInputHeight(newHeight);
  };

  const { data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  const chattingUserId =
    chat?.owner_id === userId ? chat?.customer_id : chat?.owner_id;
  const { data: owner } = useUserProfile(chattingUserId!);
  const { data: carTitle } = useCarTitle(chat?.car_id ?? null);

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
            cachePolicy="memory-disk"
            transition={200}
            contentFit="cover"
            priority="high"
          />

          <View style={styles.headerText}>
            <UIText size="lg" numberOfLines={1} ellipsizeMode="tail">
              {owner?.fullname || "Owner"}
            </UIText>
            <UIText
              size="xs"
              color="textSecondary"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {carTitle ?? "—"}
            </UIText>
          </View>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          keyboardShouldPersistTaps="handled"
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
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          windowSize={10}
          initialNumToRender={15}
          updateCellsBatchingPeriod={50}
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
            <View
              style={[
                styles.inputWrapper,
                { maxHeight: theme.verticalScale(120), overflow: "hidden" },
              ]}
            >
              <UIInput
                placeholder="Type a message..."
                value={inputText}
                onChangeText={handleChangeInput}
                multiline
                maxLength={500}
                scrollEnabled={true}
                onContentSizeChange={handleContentSizeChange}
                containerStyle={{ marginBottom: 0 }}
                style={[styles.input, { height: inputHeight }]}
              />
            </View>
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
                size={theme.scale(20)}
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
    paddingVertical: theme.spacing.lg,
    minHeight: theme.verticalScale(70),
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
    width: theme.scale(40),
    height: theme.scale(40),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: theme.spacing.xs,
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
    fontSize: theme.scale(10),
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
  inputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    borderRadius: theme.borderRadius.full,
    minHeight: theme.verticalScale(56),
    textAlignVertical: "top",
    includeFontPadding: false,
  },
  sendButton: {
    width: theme.scale(40),
    height: theme.scale(40),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: theme.colors.primary,
  },
}));
