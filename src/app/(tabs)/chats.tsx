import { ChatListItem } from "@/src/ui/components/ChatListItem";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { useUserChats } from "../../api/chat";
import { useOnlineUsersContext } from "../../contexts/OnlineUsersContext";
import { UIText } from "../../ui";

export default function MessengerScreen() {
  const user = useUser();
  const userId = user?.id;

  const {
    data: chats,
    refetch,
    isFetching,
    isRefetching,
  } = useUserChats(userId);

  const { onlineUserIdSet } = useOnlineUsersContext();
  const otherOnlineCount = onlineUserIdSet.has(userId || "")
    ? onlineUserIdSet.size - 1
    : onlineUserIdSet.size;

  return (
    <View testID="chats-screen" style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <UIText size="xxl" weight="bold">
            Chats
          </UIText>
          {otherOnlineCount > 0 && (
            <View style={styles.onlineBadgeRow}>
              <View style={styles.onlinePulse} />
              <UIText size="xs" color="primary">
                {otherOnlineCount} {otherOnlineCount === 1 ? "user" : "users"}{" "}
                online
              </UIText>
            </View>
          )}
        </View>
      </View>

      <FlashList
        onRefresh={refetch}
        refreshing={isFetching}
        data={chats}
        renderItem={({ item }) => (
          <ChatListItem item={item} onlineUserIdSet={onlineUserIdSet} />
        )}
        keyExtractor={(item) => item?.id || ""}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isRefetching ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={40}
                  color={styles.emptyIcon.color}
                />
              </View>
              <UIText size="lg" weight="semibold" style={styles.emptyTitle}>
                No conversations yet
              </UIText>
              <UIText size="sm" color="textSecondary" style={styles.emptyText}>
                Start by browsing a car listing and contacting the seller.
              </UIText>
            </View>
          ) : null
        }
      />
      {isRefetching && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={styles.loader.color} />
            <UIText style={styles.loadingText}>Loading chats...</UIText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.sm,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderLight,
  },
  onlineBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  onlinePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: rt.insets.bottom + 100,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    color: theme.colors.primary,
  },
  loader: {
    color: theme.colors.primary,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + "18",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 20,
  },
}));
