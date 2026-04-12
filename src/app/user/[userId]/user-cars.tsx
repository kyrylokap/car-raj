import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { Presets } from "react-native-pulsar";
import { StyleSheet } from "react-native-unistyles";
import { useUserCars } from "../../../api/car";
import { useUserDetailsById } from "../../../api/userProfile";
import { UIText } from "../../../ui";
import { CarItem } from "../../../ui/components/CarItem";

export default function UserProfileWithCarsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: userDetails } = useUserDetailsById(params.userId as string);
  const {
    data: userCars,
    refetch,
    isRefetching,
    isLoading,
    isFetching,
  } = useUserCars(params.userId as string);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Presets.System.impactLight();
            router.back();
          }}
          style={styles.backButton}
          hitSlop={14}
        >
          <Ionicons
            name="arrow-back"
            hitSlop={14}
            size={24}
            color={styles.headerIcon.color}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image
            style={styles.headerAvatar}
            source={{ uri: userDetails?.image_url! }}
            cachePolicy="memory-disk"
            transition={100}
            contentFit="cover"
            priority="normal"
            recyclingKey={userDetails?.id}
            allowDownscaling={true}
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

      <FlashList
        onRefresh={refetch}
        refreshing={isRefetching}
        data={userCars}
        renderItem={({ item }) => {
          return <CarItem item={item} />;
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="car-outline"
              size={64}
              color={styles.secondaryIcon.color}
            />
            <UIText size="lg" color="textSecondary" style={styles.emptyText}>
              No cars listed yet
            </UIText>
          </View>
        }
      />
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={styles.primaryIcon.color} />
            <UIText style={styles.loadingText}>
              Loading cars...
            </UIText>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  primaryIcon: {
    color: theme.colors.primary,
  },
  secondaryIcon: {
    color: theme.colors.textSecondary,
  },
  headerIcon: {
    color: theme.colors.text,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
  },
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
}));
