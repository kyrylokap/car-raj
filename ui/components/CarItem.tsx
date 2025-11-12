import { Car, useCarFirstImage } from "@/api/car";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UICard } from "../UICard";
import { UIText } from "../UIText";

export const CarItem = ({ item }: { item: Car }) => {
  const { theme } = useUnistyles();
  const {
    data: firstImageUrl,
    isLoading: isFirstImageLoading,
    isFetching: isFirstImageFetching,
  } = useCarFirstImage({
    userId: item.user_id,
    carId: item.id!,
  });
  return (
    <TouchableOpacity
      onPress={() => router.push(`/car/${item?.id}`)}
      activeOpacity={0.7}
    >
      <UICard variant="elevated" style={styles.carCard}>
        {isFirstImageFetching || isFirstImageLoading ? (
          <View style={styles.carImageContainer}>
            <View style={styles.carImagePlaceholder}>
              <Ionicons
                name="car"
                size={48}
                color={theme.colors.textSecondary}
              />
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: firstImageUrl! }}
            style={styles.carImageContainer}
          />
        )}

        <View style={styles.carInfo}>
          <UIText size="lg" style={styles.carTitle}>
            {item?.brand} {item?.model}
          </UIText>
          <UIText size="sm" color="textSecondary" style={styles.carYear}>
            {item?.year} year • {item?.mileage} km • {item?.fuel}
          </UIText>
          <View style={styles.carFooter}>
            <UIText size="lg" color="primary">
              {item?.price?.toLocaleString()} PLN
            </UIText>
            <UIText size="sm" color="textSecondary">
              {item?.location}
            </UIText>
          </View>
        </View>
      </UICard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create((theme) => ({
  carCard: {
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  carImageContainer: {
    width: "100%",
    height: 200,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
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
}));
