import { ChatWithDetails, useCarTitle } from "@/src/api/chat";
import { formatChatTime } from "@/src/utils/chat";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UICard } from "../UICard";
import { UIText } from "../UIText";

export const ChatListItem = ({
  item: chat,
  onlineUserIdSet,
}: {
  item: ChatWithDetails;
  onlineUserIdSet?: Set<string>;
}) => {
  const { data: carTitle } = useCarTitle(chat.car_id);
  const router = useRouter();
  const { theme } = useUnistyles();
  const handleNavigateToCar = useCallback(() => {
    router.push(`/car/${chat.car_id}`);
  }, [chat]);

  const lastMessageText = chat.last_message_text ?? "";
  const lastMessageTime = formatChatTime(chat.last_message_time);
  const otherUserId = chat.other_details?.id ?? null;
  const isOnline = otherUserId ? onlineUserIdSet?.has(otherUserId) : false;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/chat/${chat.id}`);
      }}
      activeOpacity={0.7}
    >
      <UICard variant="outlined" style={styles.chatCard}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarPlaceholder}
            source={{ uri: chat.other_details?.image_url! }}
            cachePolicy="memory-disk"
            transition={100}
            contentFit="cover"
            priority="normal"
            recyclingKey={chat.other_details?.id}
            allowDownscaling={true}
          />
          {isOnline ? <View style={styles.onlineDot} /> : null}
        </View>

        <View style={styles.chatContent}>
          <UIText size="sm" color="primary" style={styles.carTitle}>
            {carTitle}
          </UIText>
          <View style={styles.nameRow}>
            <UIText size="lg" style={styles.chatUserName} numberOfLines={1}>
              {chat.other_details?.fullname}
            </UIText>
          </View>
          <View style={styles.lastMessageContainer}>
            <UIText size="xs" color="textSecondary" style={styles.timeText}>
              {lastMessageTime ?? ""}
            </UIText>

            <UIText
              size="sm"
              color="textSecondary"
              style={styles.lastMessageText}
              numberOfLines={1}
            >
              {lastMessageText || "No messages yet"}
            </UIText>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable hitSlop={14} onPress={handleNavigateToCar}>
            <Ionicons
              name="car-outline"
              size={24}
              color={theme.colors.primary}
            />
          </Pressable>
          <Pressable hitSlop={14}>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        </View>
      </UICard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.s(24),
  },

  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },

  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },

  avatarPlaceholder: {
    width: theme.s(56),
    height: theme.s(56),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  onlineDot: {
    position: "absolute",
    right: theme.s(0),
    bottom: theme.s(0),
    width: theme.s(12),
    height: theme.s(12),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.success,
    borderWidth: theme.s(2),
    borderColor: theme.colors.card,
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  chatContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  timeText: {
    flexShrink: 0,
  },

  chatUserName: {
    flex: 1,
    minWidth: 0,
  },
  lastMessageText: {
    minWidth: 0,
  },
  carTitle: {
    marginTop: theme.spacing.xs,
  },
}));
