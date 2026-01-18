import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUserCars } from "../../../api/car";
import { useUserDetailsById } from "../../../api/userProfile";
import { UIText } from "../../../ui";
import { CarItem } from "../../../ui/components/CarItem";

export default function UserProfileWithCarsScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: userDetails, isLoading: userDetailsIsLoading } =
    useUserDetailsById(params.userId as string);
  const { data: userCars, isLoading: userCarsIsLoading } = useUserCars(
    params.userId as string
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            hitSlop={14}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image
            style={styles.headerAvatar}
            source={{ uri: userDetails?.image_url! }}
          />
          <View style={styles.headerText}>
            <UIText size="lg">{userDetails?.fullname}</UIText>
            <UIText size="xs" color="textSecondary">
              {userCars?.length} {userCars?.length === 1 ? "car" : "cars"}{" "}
              listed
            </UIText>
          </View>
        </View>
      </View>

      <FlatList
        data={userCars}
        renderItem={({ item }) => {
          return <CarItem item={item} />;
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: rt.insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="car-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <UIText size="lg" color="textSecondary" style={styles.emptyText}>
              No cars listed yet
            </UIText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  safeArea: {
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
  listContent: {
    padding: theme.spacing.md,
  },
  carCard: {
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  carImageContainer: {
    width: "100%",
    height: 200,
    marginBottom: theme.spacing.md,
  },
  carImagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
  },
  carInfo: {
    gap: theme.spacing.xs,
  },
  carTitle: {
    marginBottom: theme.spacing.xs,
  },
  carYear: {
    marginBottom: theme.spacing.sm,
  },
  carFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.sm,
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
