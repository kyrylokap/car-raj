import { ChatListItem } from "@/src/ui/components/ChatListItem";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { useUserChats } from "../../api/chat";
import { useOnlineUsersContext } from "../../contexts/OnlineUsersContext";
import { UIContainer, UIText } from "../../ui";

export default function MessengerScreen() {
  const { theme, rt } = useUnistyles();
  const user = useUser();
  const userId = user?.id;

  const {
    data: chats,
    refetch,
    isRefetching,
    isLoading,
    isFetching,
  } = useUserChats(userId);
  const { onlineUserIdSet } = useOnlineUsersContext();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UIContainer>
        <View style={styles.header}>
          <UIText size="xxl" style={styles.headerTitle}>
            Chats
          </UIText>
        </View>
        <FlatList
          onRefresh={refetch}
          refreshing={isRefetching}
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
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubbles-outline"
                size={64}
                color={theme.colors.textSecondary}
              />
              <UIText size="lg" color="textSecondary" style={styles.emptyText}>
                No messages yet
              </UIText>
            </View>
          }
        />
        {(isLoading || isFetching) && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <UIText style={{ marginTop: theme.spacing.sm }}>
                Loading chats...
              </UIText>
            </View>
          </View>
        )}
      </UIContainer>
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
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    marginTop: theme.spacing.md,
  },
}));
