import { useCarFirstImage } from "@/src/api/car";
import { ChatWithDetails, useCarTitle } from "@/src/api/chat";
import { formatChatTime } from "@/src/utils/chat";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UIText } from "../UIText";

export const ChatListItem = ({
  item: chat,
  onlineUserIdSet,
}: {
  item: ChatWithDetails;
  onlineUserIdSet?: Set<string>;
}) => {
  const { data: carTitle } = useCarTitle(chat.car_id);
  const { data: carImage, isLoading: isCarImageLoading } = useCarFirstImage({
    userId: chat.owner_id ?? "",
    carId: chat.car_id ?? "",
  });
  const router = useRouter();
  const { theme } = useUnistyles();
  const handleNavigateToCar = useCallback(() => {
    router.push(`/car/${chat.car_id}`);
  }, [chat]);

  const lastMessageText = chat.last_message_text ?? "";
  const lastMessageTime = formatChatTime(chat.last_message_time);
  const otherUserId = chat.other_details?.id ?? null;
  const isOnline = otherUserId ? onlineUserIdSet?.has(otherUserId) : false;
  const name = chat.other_details?.fullname ?? "Unknown";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <TouchableOpacity
      onPress={() => router.push(`/chat/${chat.id}`)}
      activeOpacity={0.75}
      style={styles.row}
    >
      <View style={styles.avatarWrap}>
        {chat.other_details?.image_url ? (
          <Image
            style={styles.avatar}
            source={{ uri: chat.other_details.image_url }}
            cachePolicy="memory-disk"
            transition={150}
            contentFit="cover"
            priority="normal"
            recyclingKey={chat.other_details.id}
            allowDownscaling
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <UIText style={styles.initials}>{initials}</UIText>
          </View>
        )}
        <View
          style={[
            styles.onlineDot,
            isOnline ? styles.onlineDotActive : styles.onlineDotInactive,
          ]}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <UIText
            size="lg"
            weight="semibold"
            numberOfLines={1}
            style={styles.name}
          >
            {name}
          </UIText>
        </View>

        <UIText size="xs" color="textSecondary" style={styles.timeTitleRow}>
          {carTitle ?? "Loading car..."} · {lastMessageTime}
        </UIText>

        <UIText
          size="sm"
          color="textSecondary"
          numberOfLines={1}
          style={styles.preview}
        >
          {lastMessageText || "No messages yet"}
        </UIText>
      </View>

      <TouchableOpacity
        style={styles.carThumbnailWrap}
        activeOpacity={0.7}
        onPress={handleNavigateToCar}
        hitSlop={8}
      >
        {carImage ? (
          <Image
            style={styles.carThumbnail}
            source={{ uri: carImage }}
            cachePolicy="memory-disk"
            transition={200}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.carThumbnail, styles.carThumbnailFallback]}>
            <Ionicons name="car-sport" size={20} color={theme.colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 0,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
  },

  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: theme.s(56),
    height: theme.s(56),
    borderRadius: theme.borderRadius.full,
  },
  avatarFallback: {
    backgroundColor: theme.colors.primary + "15",
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: theme.s(20),
  },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: theme.s(14),
    height: theme.s(14),
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  onlineDotActive: {
    backgroundColor: theme.colors.success,
  },
  onlineDotInactive: {
    backgroundColor: theme.colors.borderLight,
  },

  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flex: 1,
    minWidth: 0,
    letterSpacing: -0.3,
  },
  timeTitleRow: {
    marginTop: 2,
    opacity: 0.8,
  },
  preview: {
    marginTop: 4,
    minWidth: 0,
  },
  carThumbnailWrap: {
    marginLeft: theme.spacing.xs,
  },
  carThumbnail: {
    width: theme.s(52),
    height: theme.s(52),
    borderRadius: theme.borderRadius.md,
  },
  carThumbnailFallback: {
    backgroundColor: theme.colors.primary + "18",
    alignItems: "center",
    justifyContent: "center",
  },
}));
