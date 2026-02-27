import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Car, useCarFirstImage } from "../../api/car";
import { UIText } from "../UIText";

export const CarItem = ({ item }: { item: Car }) => {
  const { theme } = useUnistyles();
  const {
    data: firstImageUrl,
    isLoading: isFirstImageLoading,
    isFetching: isFirstImageFetching,
  } = useCarFirstImage({
    userId: item.user_id!,
    carId: item.id!,
  });

  const isLoading = isFirstImageFetching || isFirstImageLoading;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/car/${item?.id}`)}
      activeOpacity={0.88}
      style={styles.wrapper}
    >
      <View style={styles.imageContainer}>
        {isLoading ? (
          <View style={styles.placeholder}>
            <Ionicons
              name="car-outline"
              size={52}
              color={theme.colors.textSecondary}
            />
          </View>
        ) : (
          <Image
            source={{ uri: firstImageUrl! }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            priority="high"
            recyclingKey={item.id}
            allowDownscaling
          />
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.78)"]}
          style={styles.scrim}
          pointerEvents="none"
        />

        <View style={styles.priceBadge}>
          <UIText size="sm" style={styles.priceText}>
            {item?.price?.toLocaleString()} PLN
          </UIText>
        </View>

        {!!item?.location && (
          <View style={styles.locationChip}>
            <Ionicons
              name="location-sharp"
              size={11}
              color="rgba(255,255,255,0.75)"
            />
            <UIText size="xxs" style={styles.locationText}>
              {item.location}
            </UIText>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <UIText size="lg" weight="semibold" numberOfLines={1}>
          {item?.brand} {item?.model}
        </UIText>

        <View style={styles.pills}>
          <View style={styles.pill}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={theme.colors.textSecondary}
            />
            <UIText size="xs" color="textSecondary">
              {item?.year}
            </UIText>
          </View>

          <View style={styles.dot} />

          <View style={styles.pill}>
            <Ionicons
              name="speedometer-outline"
              size={12}
              color={theme.colors.textSecondary}
            />
            <UIText size="xs" color="textSecondary">
              {item?.mileage?.toLocaleString()} km
            </UIText>
          </View>

          <View style={styles.dot} />

          <View style={styles.pill}>
            <Ionicons
              name="flame-outline"
              size={12}
              color={theme.colors.textSecondary}
            />
            <UIText size="xs" color="textSecondary">
              {item?.fuel}
            </UIText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.card,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  imageContainer: {
    width: "100%",
    height: theme.vs(210),
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  scrim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  priceBadge: {
    position: "absolute",
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  priceText: {
    color: "#fff",
    fontWeight: "700",
  },
  locationChip: {
    position: "absolute",
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.42)",
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  locationText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
  },
  info: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  pills: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
}));
