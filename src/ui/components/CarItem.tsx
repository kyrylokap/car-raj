import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Car, useCarFirstImage } from "../../api/car";
import { UIText } from "../UIText";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { formatPostedTime } from "../../utils/time";

export const CarItem = ({
  item,
  onPress,
  testID,
}: {
  item: Car;
  onPress?: () => void;
  testID?: string;
}) => {
  const {
    data: firstImageUrl,
    isLoading: isFirstImageLoading,
    isFetching: isFirstImageFetching,
  } = useCarFirstImage({
    userId: item.user_id!,
    carId: item.id!,
  });

  const isLoading = isFirstImageFetching || isFirstImageLoading;

  const handlePress = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    } else {
      router.push(`/car/${item?.id}`);
    }
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      activeOpacity={0.88}
      style={styles.wrapper}
    >
      <View style={styles.imageContainer}>
        {isLoading ? (
          <View style={styles.placeholder}>
            <Ionicons
              name="car-outline"
              size={52}
              color={styles.secondaryIcon.color}
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

        <View style={styles.timeBadge}>
          <Ionicons
            name="time-outline"
            size={11}
            color="rgba(255,255,255,0.75)"
          />
          <UIText size="xxs" style={styles.timeBadgeText}>
            {formatPostedTime(item?.created_at)}
          </UIText>
        </View>

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
              color={styles.secondaryIcon.color}
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
              color={styles.secondaryIcon.color}
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
              color={styles.secondaryIcon.color}
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
  secondaryIcon: {
    color: theme.colors.textSecondary,
  },
  wrapper: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xxl,
    backgroundColor: theme.colors.surfaceElevated,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  imageContainer: {
    width: "100%",
    height: theme.vs(220),
    position: "relative",
    backgroundColor: theme.colors.surfaceVariant,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  scrim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65%",
  },
  priceBadge: {
    position: "absolute",
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  priceText: {
    color: theme.colors.textInverse,
    fontWeight: "700",
    fontSize: theme.s(15),
  },
  locationChip: {
    position: "absolute",
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.s(4),
    backgroundColor: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(8px)",
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  timeBadge: {
    position: "absolute",
    top: theme.spacing.md,
    left: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.s(4),
    backgroundColor: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(8px)",
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  timeBadgeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: theme.s(11),
    fontWeight: "500",
  },
  locationText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: theme.s(11),
    fontWeight: "500",
  },
  info: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  pills: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.s(4),
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
}));
