import { ChatListItem } from "@/src/ui/components/ChatListItem";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { useUserChats } from "../../api/chat";
import { useOnlineUsersContext } from "../../contexts/OnlineUsersContext";
import { UIText } from "../../ui";

export default function MessengerScreen() {
  const { theme, rt } = useUnistyles();
  const user = useUser();
  const userId = user?.id;

  const {
    data: chats,
    refetch,
    isLoading,
    isFetching,
  } = useUserChats(userId);

  const { onlineUserIdSet } = useOnlineUsersContext();
  const otherOnlineCount = onlineUserIdSet.has(userId || "")
    ? onlineUserIdSet.size - 1
    : onlineUserIdSet.size;

  return (
    <SafeAreaView testID="chats-screen" style={styles.safeArea} edges={["top"]}>
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

      <FlatList
        onRefresh={refetch}
        refreshing={isFetching}
        data={chats}
        renderItem={({ item }) => (
          <ChatListItem item={item} onlineUserIdSet={onlineUserIdSet} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: rt.insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={40}
                  color={theme.colors.primary}
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
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <UIText style={{ marginTop: theme.spacing.sm }}>
              Loading chats...
            </UIText>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
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
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
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
