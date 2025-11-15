import { useCarById, useCarImages } from "@/api/car";
import { useChangeFavorite, useIsCarFavorite } from "@/api/favorites";
import { UIButton, UICard, UIContainer, UIText } from "@/ui";
import { ImagesCarousel } from "@/ui/components/ImagesCarousel";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function CarDetailsScreen() {
  const { theme, rt } = useUnistyles();
  const router = useRouter();
  const params = useLocalSearchParams();

  const carId = params.id as string;
  const { data: isFavorite } = useIsCarFavorite(carId);

  const [isCarFavorite, setIsCarFavorite] = useState<boolean>(isFavorite!);
  const { data: car, isLoading } = useCarById(carId);
  const {
    data: carImages,
    isLoading: imagesIsLoading,
    isFetching: imagesIsFetching,
  } = useCarImages({ userId: car?.user_id!, carId });
  const { mutate: pressFavorite } = useChangeFavorite();
  const onPressFavorite = () => {
    pressFavorite(carId);
    setIsCarFavorite((prev) => !prev);
  };
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <UIContainer>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.emptyState}>
            <ActivityIndicator />
          </View>
        </UIContainer>
      </SafeAreaView>
    );
  }

  const createdTime = new Date(car!.created_at).toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const specsWithIcons = [
    { icon: "car-outline", label: "Brand", value: car?.brand },
    { icon: "pricetag-outline", label: "Model", value: car?.model },
    { icon: "calendar-outline", label: "Year", value: car?.year },

    {
      icon: "speedometer-outline",
      label: "Mileage",
      value: car?.mileage ? `${car.mileage} km` : "-",
    },
    {
      icon: "cash-outline",
      label: "Price",
      value: car?.price ? `${car.price.toLocaleString()} PLN` : "-",
    },
    { icon: "flash-outline", label: "Fuel Type", value: car?.fuel },
    {
      icon: "options-outline",
      label: "Transmission",
      value: car?.transmission,
    },
    { icon: "color-palette-outline", label: "Color", value: car?.color },
    { icon: "location-outline", label: "Location", value: car?.location },
    { icon: "time-outline", label: "Created", value: createdTime },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name="share-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onPressFavorite}
          >
            <Ionicons
              name={isCarFavorite ? "heart" : "heart-outline"}
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: rt.insets.bottom + theme.spacing.xl },
        ]}
      >
        <View style={{ padding: 20 }}>
          <UIText size="xxl" style={styles.carTitle}>
            {car?.brand} {car?.model}
          </UIText>
          <UIText size="lg" color="primary" style={styles.price}>
            {car?.price?.toLocaleString()} PLN
          </UIText>
        </View>

        {imagesIsFetching || imagesIsLoading ? (
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" />
            </View>
          </View>
        ) : (
          <ImagesCarousel images={carImages!} />
        )}
        <UIContainer>
          <UICard variant="elevated" style={styles.specsCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Specifications
            </UIText>

            <View style={styles.specsList}>
              <View style={styles.specRow}>
                <UIText style={{ color: theme.colors.textSecondary }}>
                  VIN
                </UIText>

                <UIText weight="semibold">{car?.vin}</UIText>
              </View>
              {specsWithIcons.map((spec) => (
                <View key={spec.label} style={styles.specRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name={spec.icon as any}
                      size={18}
                      color={theme.colors.textSecondary}
                    />
                    <UIText color="textSecondary">{spec.label}</UIText>
                  </View>
                  <UIText weight="semibold">{spec.value ?? "-"}</UIText>
                </View>
              ))}
            </View>
          </UICard>

          <UICard variant="elevated" style={styles.descriptionCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Description
            </UIText>
            <UIText color="textSecondary" style={styles.description}>
              {car?.description}
            </UIText>
          </UICard>
          <View style={styles.actionButtons}>
            <UIButton
              variant="outline"
              style={styles.contactButton}
              onPress={() => {
                router.push(`/chat/${carId}`);
              }}
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={theme.colors.primary}
                style={styles.buttonIcon}
              />
              <UIText weight="semibold">Contact Seller</UIText>
            </UIButton>
            <UIButton
              variant="primary"
              style={styles.callButton}
              onPress={() => {}}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={theme.colors.white}
                style={styles.buttonIcon}
              />
              <UIText color="white" weight="semibold">
                Call Now
              </UIText>
            </UIButton>
          </View>
        </UIContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  currentImageText: {
    position: "absolute",
    bottom: 8,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.surface,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  titleSection: {
    marginBottom: theme.spacing.lg,
  },
  carTitle: {
    marginBottom: theme.spacing.xs,
  },
  price: {
    marginTop: theme.spacing.xs,
  },
  detailsCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  detailContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  descriptionCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  description: {
    lineHeight: 22,
  },
  specsCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  specsList: {
    gap: theme.spacing.md,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  buttonIcon: {
    marginRight: theme.spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
}));
