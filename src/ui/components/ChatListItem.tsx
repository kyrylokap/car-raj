import { useCarFirstImage } from "@/src/api/car";
import { ChatWithDetails, useCarTitle, useDeleteChat } from "@/src/api/chat";
import { formatChatTime } from "@/src/utils/chat";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { UIText } from "../UIText";

const SWIPE_THRESHOLD = -100;

export const ChatListItem = ({
  item: chat,
  onlineUserIdSet,
}: {
  item: ChatWithDetails;
  onlineUserIdSet?: Set<string>;
}) => {
  const { data: carTitle } = useCarTitle(chat.car_id);
  const { data: carImage } = useCarFirstImage({
    userId: chat.owner_id ?? "",
    carId: chat.car_id ?? "",
  });
  const router = useRouter();
  const { mutate: deleteChat } = useDeleteChat({ chatId: chat.id });

  const translateX = useSharedValue(0);

  const handlePressChat = () => {
    if (translateX.value < -20) {
      translateX.value = withSpring(0);
      return;
    }
    Haptics.selectionAsync();
    router.push(`/chat/${chat.id}`);
  };

  const handleNavigateToCarWithHaptic = (e: any) => {
    e.stopPropagation();
    Haptics.selectionAsync();
    router.push(`/car/${chat.car_id}`);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteChat();
    translateX.value = withTiming(-500, { duration: 250 });
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Увеличили порог, чтобы не "люфтило" при скролле
    .failOffsetY([-10, 10])
    .onChange((event) => {
      const nextX = translateX.value + event.changeX;
      translateX.value = Math.min(0, nextX);
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD / 2) {
        // Делаем пружину жестче (stiffness) и четче
        translateX.value = withSpring(SWIPE_THRESHOLD, {
          damping: 25,
          stiffness: 180,
          mass: 0.8,
        });
      } else {
        translateX.value = withSpring(0, {
          damping: 25,
          stiffness: 180,
          mass: 0.8,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-100, -20],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [SWIPE_THRESHOLD, 0],
          [0, 100],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

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
    <View style={styles.container}>
      <Animated.View style={[styles.deleteButtonContainer, deleteButtonStyle]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={26} color={styles.whiteIcon.color} />
          <UIText
            color="white"
            size="xs"
            weight="bold"
            style={{ marginTop: 4 }}
          >
            Delete
          </UIText>
        </TouchableOpacity>
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.row, animatedStyle]}>
          <TouchableOpacity
            onPress={handlePressChat}
            activeOpacity={0.8}
            style={styles.pressableContent}
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

              <UIText
                size="xs"
                color="textSecondary"
                style={styles.timeTitleRow}
              >
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
              onPress={handleNavigateToCarWithHaptic}
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
                <View
                  style={[styles.carThumbnail, styles.carThumbnailFallback]}
                >
                  <Ionicons
                    name="car-sport"
                    size={20}
                    color={styles.primaryIcon.color}
                  />
                </View>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  primaryIcon: {
    color: theme.colors.primary,
  },
  whiteIcon: {
    color: theme.colors.white,
  },
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    position: "relative",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 1,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
    zIndex: 2,
  },
  pressableContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
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
