import { UICard, UIContainer, UIText } from "@/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Chat = {
  id: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  carTitle: string;
};

const mockChats: Chat[] = [
  {
    id: "1",
    userName: "John Smith",
    lastMessage: "Is the car still available?",
    timestamp: "2 min ago",
    unreadCount: 2,
    avatar: "https://via.placeholder.com/50",
    carTitle: "BMW 320d 2020",
  },
  {
    id: "2",
    userName: "Anna Kowalska",
    lastMessage: "Can we schedule a viewing?",
    timestamp: "1 hour ago",
    unreadCount: 0,
    avatar: "https://via.placeholder.com/50",
    carTitle: "Mercedes C-Class 2021",
  },
  {
    id: "3",
    userName: "Michael Brown",
    lastMessage: "Thanks for the quick response!",
    timestamp: "3 hours ago",
    unreadCount: 1,
    avatar: "https://via.placeholder.com/50",
    carTitle: "Audi A4 2019",
  },
];

export default function MessengerScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      onPress={() => router.push(`/chat/${item.id}`)}
      activeOpacity={0.7}
    >
      <UICard variant="outlined" style={styles.chatCard}>
        <View style={styles.chatAvatar}>
          <View style={styles.avatarPlaceholder}>
            <UIText size="lg" color="textSecondary">
              {item.userName.charAt(0)}
            </UIText>
          </View>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <UIText size="xs" color="white" style={styles.unreadText}>
                {item.unreadCount}
              </UIText>
            </View>
          )}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <UIText size="lg" style={styles.chatUserName}>
              {item.userName}
            </UIText>
            <UIText size="xs" color="textSecondary">
              {item.timestamp}
            </UIText>
          </View>
          <UIText size="sm" color="textSecondary" numberOfLines={1}>
            {item.lastMessage}
          </UIText>
          <UIText size="xs" color="primary" style={styles.carTitle}>
            {item.carTitle}
          </UIText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </UICard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UIContainer>
        <View style={styles.header}>
          <UIText size="xxl" style={styles.headerTitle}>
            Messages
          </UIText>
        </View>
        <FlatList
          data={mockChats}
          renderItem={renderChatItem}
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

const stylesheet = StyleSheet.create((theme) => ({
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
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
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
