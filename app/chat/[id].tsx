import { UIText } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Message = {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isOwn: boolean;
};

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hello! Is the car still available?",
    senderId: "other",
    timestamp: "10:30",
    isOwn: false,
  },
  {
    id: "2",
    text: "Yes, it is! Would you like to schedule a viewing?",
    senderId: "me",
    timestamp: "10:32",
    isOwn: true,
  },
  {
    id: "3",
    text: "That would be great! When are you available?",
    senderId: "other",
    timestamp: "10:33",
    isOwn: false,
  },
  {
    id: "4",
    text: "I can do tomorrow afternoon or this weekend. What works for you?",
    senderId: "me",
    timestamp: "10:35",
    isOwn: true,
  },
];

export default function ChatScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const params = useLocalSearchParams();
  const chatId = params.id as string;
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        senderId: "me",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setInputText("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.messageOwn : styles.messageOther,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther,
        ]}
      >
        <UIText
          size="default"
          style={[styles.messageText, item.isOwn && styles.messageTextOwn]}
        >
          {item.text}
        </UIText>
        <UIText
          size="xxs"
          style={[
            styles.messageTimestamp,
            item.isOwn && styles.messageTimestampOwn,
          ]}
        >
          {item.timestamp}
        </UIText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfo}
          onPress={() => router.push(`/user/${chatId}/cars`)}
          activeOpacity={0.7}
        >
          <View style={styles.headerAvatar}>
            <UIText size="lg" color="white">
              J
            </UIText>
          </View>
          <View style={styles.headerText}>
            <UIText size="lg">John Smith</UIText>
            <UIText size="xs" color="textSecondary">
              BMW 320d 2020
            </UIText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() && styles.sendButtonActive,
            ]}
            onPress={sendMessage}
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
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
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
    alignItems: "flex-end",
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
    maxHeight: 100,
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
