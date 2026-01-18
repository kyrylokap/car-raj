import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUser } from "../../api/auth";
import { ChatWithDetails, useCarTitle, useUserChats } from "../../api/chat";
import { UICard, UIContainer, UIText } from "../../ui";

export default function MessengerScreen() {
  const { theme, rt } = useUnistyles();
  const user = useUser();
  const userId = user?.id;

  const { data: chats, refetch, isRefetching } = useUserChats(userId);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UIContainer>
        <View style={styles.header}>
          <UIText size="xxl" style={styles.headerTitle}>
            Chats
          </UIText>
        </View>
        <FlatList
          data={chats}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          renderItem={({ item }) => <ChatListItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: rt.insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
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
      </UIContainer>
    </SafeAreaView>
  );
}

const ChatListItem = ({ item: chat }: { item: ChatWithDetails }) => {
  const { data: carTitle } = useCarTitle(chat.car_id);
  const router = useRouter();
  const { theme } = useUnistyles();
  const handleNaviateToCar = useCallback(() => {
    router.push(`/car/${chat.car_id}`);
  }, [chat]);
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/chat/${chat.id}`);
      }}
      activeOpacity={0.7}
    >
      <UICard variant="outlined" style={styles.chatCard}>
        <Image
          style={styles.avatarPlaceholder}
          source={{ uri: chat.other_details?.image_url! }}
        />

        <View style={styles.chatContent}>
          <UIText size="sm" color="primary" style={styles.carTitle}>
            {carTitle}
          </UIText>
          <UIText size="lg" style={styles.chatUserName}>
            {chat.other_details?.fullname}
          </UIText>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable hitSlop={14} onPress={handleNaviateToCar}>
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
    gap: 24,
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
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  chatAvatar: {
    position: "relative",
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  chatContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatUserName: {
    flex: 1,
  },
  carTitle: {
    marginTop: theme.spacing.xs,
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
