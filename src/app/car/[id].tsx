import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useCarImages } from "../../api/car";
import { useCarDetails } from "../../hooks/useCarDetails";
import { UIButton, UIText } from "../../ui";
import { ImagesCarousel } from "../../ui/components/ImagesCarousel";

export default function CarDetailsScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const params = useLocalSearchParams();
  const carId = params.id as string;

  const {
    car,
    isLoading,
    isCarFavorite,
    handleToggleFavorite,
    handleContactSeller,
    handleCall,
    getSpecsWithIcons,
  } = useCarDetails(carId);

  const {
    data: carImages,
    isLoading: imagesIsLoading,
    isFetching: imagesIsFetching,
  } = useCarImages({ userId: car?.user_id!, carId });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const specsWithIcons = getSpecsWithIcons();

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll]}
      >
        <View style={styles.heroContainer}>
          {imagesIsFetching || imagesIsLoading ? (
            <View style={styles.heroPlaceholder}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <ImagesCarousel images={carImages!} hero />
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.52)", "transparent"]}
            style={styles.topScrim}
            pointerEvents="none"
          />
        </View>

        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <UIText size="xxl" weight="bold" numberOfLines={1}>
                {car?.brand} {car?.model}
              </UIText>
              <UIText size="xs" color="textSecondary">
                {car?.year} · {car?.location}
              </UIText>
            </View>
            <View style={styles.pricePill}>
              <UIText size="sm" style={styles.priceLabel}>
                Price
              </UIText>
              <UIText size="md" weight="bold" color="primary">
                {car?.price?.toLocaleString()} PLN
              </UIText>
            </View>
          </View>

          <View style={styles.statStrip}>
            <View style={styles.statItem}>
              <Ionicons
                name="speedometer-outline"
                size={20}
                color={theme.colors.primary}
              />
              <UIText size="sm" weight="semibold">
                {car?.mileage?.toLocaleString()}
              </UIText>
              <UIText size="xxs" color="textSecondary">
                km
              </UIText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name="flame-outline"
                size={20}
                color={theme.colors.primary}
              />
              <UIText size="sm" weight="semibold">
                {car?.fuel}
              </UIText>
              <UIText size="xxs" color="textSecondary">
                fuel
              </UIText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name="git-branch-outline"
                size={20}
                color={theme.colors.primary}
              />
              <UIText size="sm" weight="semibold">
                {car?.transmission ?? "—"}
              </UIText>
              <UIText size="xxs" color="textSecondary">
                gearbox
              </UIText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name="color-palette-outline"
                size={20}
                color={theme.colors.primary}
              />
              <UIText size="sm" weight="semibold" numberOfLines={1}>
                {car?.color ?? "—"}
              </UIText>
              <UIText size="xxs" color="textSecondary">
                color
              </UIText>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="list-outline"
                size={18}
                color={theme.colors.primary}
              />
              <UIText size="md" weight="semibold">
                Specifications
              </UIText>
            </View>

            {car?.vin ? (
              <View style={styles.specRow}>
                <UIText size="sm" color="textSecondary">
                  VIN
                </UIText>
                <UIText size="sm" weight="semibold" style={styles.specValue}>
                  {car.vin}
                </UIText>
              </View>
            ) : null}

            {specsWithIcons.map((spec, i) => (
              <View
                key={spec.label}
                style={[
                  styles.specRow,
                  i === specsWithIcons.length - 1 && styles.specRowLast,
                ]}
              >
                <View style={styles.specLabel}>
                  <Ionicons
                    name={spec.icon as any}
                    size={15}
                    color={theme.colors.textSecondary}
                  />
                  <UIText size="sm" color="textSecondary">
                    {spec.label}
                  </UIText>
                </View>
                <UIText size="sm" weight="semibold" style={styles.specValue}>
                  {spec.value ?? "—"}
                </UIText>
              </View>
            ))}
          </View>

          {!!car?.description && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <UIText size="md" weight="semibold">
                  Description
                </UIText>
              </View>
              <UIText color="textSecondary" style={styles.description}>
                {car.description}
              </UIText>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.floatingHeader]} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
          hitSlop={14}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={handleToggleFavorite}
          hitSlop={14}
        >
          <Ionicons
            name={isCarFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isCarFavorite ? "#ff4c6a" : "rgba(255,255,255,0.85)"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cta}>
        <UIButton
          variant="outline"
          style={styles.ctaBtn}
          onPress={handleContactSeller}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={theme.colors.primary}
          />
          <UIText weight="semibold">Message</UIText>
        </UIButton>
        <UIButton variant="primary" style={styles.ctaBtn} onPress={handleCall}>
          <Ionicons name="call-outline" size={18} color="#fff" />
          <UIText color="white" weight="semibold">
            Call Now
          </UIText>
        </UIButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    paddingTop: rt.insets.top,
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: rt.insets.bottom + 100,
  },

  heroContainer: {
    width: "100%",
    position: "relative",
  },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  sheet: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  pricePill: {
    alignItems: "flex-end",
    backgroundColor: `${theme.colors.primary}18`,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  priceLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },

  statStrip: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: theme.colors.borderLight,
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  specRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  specLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  specValue: {
    maxWidth: "55%",
    textAlign: "right",
  },
  description: {
    lineHeight: theme.vs(22),
  },

  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  floatingHeader: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  cta: {
    paddingBottom: rt.insets.bottom + 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.borderLight,
  },
  ctaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
}));
