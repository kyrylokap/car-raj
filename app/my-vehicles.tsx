import { useUser } from "@/api/auth";
import { Car, useUserCars } from "@/api/car";
import { UICard, UIText } from "@/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function MyListingsScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const user = useUser();
  const fetchUserCars = useUserCars();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetchUserCars(user.id)
      .then(setCars)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);
  const renderCarCard = ({ item }: { item: Car }) => (
    <TouchableOpacity
      onPress={() => router.push(`/car/${item?.id}`)}
      activeOpacity={0.7}
    >
      <UICard variant="elevated" style={styles.carCard}>
        <View style={styles.carImageContainer}>
          <View style={styles.carImagePlaceholder}>
            <Ionicons name="car" size={48} color={theme.colors.textSecondary} />
          </View>
          {item?.status === "Sold" && (
            <View style={styles.soldBadge}>
              <UIText size="xs" color="white" weight="semibold">
                SOLD
              </UIText>
            </View>
          )}
        </View>
        <View style={styles.carInfo}>
          <UIText size="lg" style={styles.carTitle}>
            {item?.brand} {item?.model}
          </UIText>
          <UIText size="sm" color="textSecondary" style={styles.carYear}>
            {item?.year} • {item?.mileage?.toLocaleString()} km • {item?.fuel}
          </UIText>
          <View style={styles.carFooter}>
            <UIText size="lg" color="primary">
              {item?.price?.toLocaleString()} PLN
            </UIText>
            <View style={styles.footerRight}>
              <UIText size="sm" color="textSecondary">
                {item?.location}
              </UIText>
              {/* {item?.status === "active" && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              )} */}
            </View>
          </View>
        </View>
      </UICard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <UIText size="xl" weight="bold">
            My vehicles
          </UIText>
          <UIText size="sm" color="textSecondary">
            {cars.length} active • {cars.length} sold
          </UIText>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/sell-vehicle")}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cars}
        renderItem={renderCarCard}
        keyExtractor={(item) => item?.id || ""}
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
              No listings yet
            </UIText>
            <UIText size="sm" color="textSecondary" style={styles.emptySubtext}>
              Sell your first car to get started
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
  headerText: {
    flex: 1,
  },
  addButton: {
    padding: theme.spacing.xs,
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
    position: "relative",
  },
  carImagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
  },
  soldBadge: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
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
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  editButton: {
    padding: theme.spacing.xs,
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
  emptySubtext: {
    marginTop: theme.spacing.xs,
  },
}));
