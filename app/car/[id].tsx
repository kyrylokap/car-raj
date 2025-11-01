import { UIButton, UICard, UIContainer, UIText } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  image: string;
  location: string;
};

const mockCars: Car[] = [
  {
    id: "1",
    brand: "BMW",
    model: "320d",
    year: 2020,
    price: 125000,
    mileage: 45000,
    fuelType: "Diesel",
    image: "https://via.placeholder.com/300x200",
    location: "Warsaw",
  },
  {
    id: "2",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2021,
    price: 145000,
    mileage: 32000,
    fuelType: "Petrol",
    image: "https://via.placeholder.com/300x200",
    location: "Krakow",
  },
  {
    id: "3",
    brand: "Audi",
    model: "A4",
    year: 2019,
    price: 110000,
    mileage: 58000,
    fuelType: "Diesel",
    image: "https://via.placeholder.com/300x200",
    location: "Wroclaw",
  },
];

export default function CarDetailsScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const params = useLocalSearchParams();
  const carId = params.id as string;

  const car = mockCars.find((c) => c.id === carId);

  if (!car) {
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
            <UIText size="lg" color="textSecondary">
              Car not found
            </UIText>
          </View>
        </UIContainer>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name="heart-outline"
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
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="car" size={80} color={theme.colors.textSecondary} />
          </View>
        </View>

        <UIContainer>
          <View style={styles.titleSection}>
            <UIText size="xxl" style={styles.carTitle}>
              {car.brand} {car.model}
            </UIText>
            <UIText size="lg" color="primary" style={styles.price}>
              {car.price.toLocaleString()} PLN
            </UIText>
          </View>

          <UICard variant="elevated" style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
                <View style={styles.detailContent}>
                  <UIText size="xs" color="textSecondary">
                    Year
                  </UIText>
                  <UIText size="default" weight="semibold">
                    {car.year}
                  </UIText>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="speedometer-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
                <View style={styles.detailContent}>
                  <UIText size="xs" color="textSecondary">
                    Mileage
                  </UIText>
                  <UIText size="default" weight="semibold">
                    {car.mileage.toLocaleString()} km
                  </UIText>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="flash-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
                <View style={styles.detailContent}>
                  <UIText size="xs" color="textSecondary">
                    Fuel Type
                  </UIText>
                  <UIText size="default" weight="semibold">
                    {car.fuelType}
                  </UIText>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
                <View style={styles.detailContent}>
                  <UIText size="xs" color="textSecondary">
                    Location
                  </UIText>
                  <UIText size="default" weight="semibold">
                    {car.location}
                  </UIText>
                </View>
              </View>
            </View>
          </UICard>

          <UICard variant="elevated" style={styles.descriptionCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Description
            </UIText>
            <UIText
              size="default"
              color="textSecondary"
              style={styles.description}
            >
              Well-maintained {car.brand} {car.model} from {car.year}. This
              vehicle has been regularly serviced and is in excellent condition.
              Perfect for daily commuting and long trips. Don't miss this
              opportunity!
            </UIText>
          </UICard>

          <UICard variant="elevated" style={styles.specsCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Specifications
            </UIText>
            <View style={styles.specsList}>
              <View style={styles.specRow}>
                <UIText size="default" color="textSecondary">
                  Brand
                </UIText>
                <UIText size="default" weight="semibold">
                  {car.brand}
                </UIText>
              </View>
              <View style={styles.specRow}>
                <UIText size="default" color="textSecondary">
                  Model
                </UIText>
                <UIText size="default" weight="semibold">
                  {car.model}
                </UIText>
              </View>
              <View style={styles.specRow}>
                <UIText size="default" color="textSecondary">
                  Year
                </UIText>
                <UIText size="default" weight="semibold">
                  {car.year}
                </UIText>
              </View>
              <View style={styles.specRow}>
                <UIText size="default" color="textSecondary">
                  Mileage
                </UIText>
                <UIText size="default" weight="semibold">
                  {car.mileage.toLocaleString()} km
                </UIText>
              </View>
              <View style={styles.specRow}>
                <UIText size="default" color="textSecondary">
                  Fuel Type
                </UIText>
                <UIText size="default" weight="semibold">
                  {car.fuelType}
                </UIText>
              </View>
            </View>
          </UICard>

          <View style={styles.actionButtons}>
            <UIButton
              variant="outline"
              style={styles.contactButton}
              onPress={() => {
                // Navigate to chat or contact seller
                router.push(`/chat/${carId}`);
              }}
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={theme.colors.primary}
                style={styles.buttonIcon}
              />
              <UIText size="default" weight="semibold">
                Contact Seller
              </UIText>
            </UIButton>
            <UIButton
              variant="primary"
              style={styles.callButton}
              onPress={() => {
                // Handle call action
              }}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={theme.colors.white}
                style={styles.buttonIcon}
              />
              <UIText size="default" color="white" weight="semibold">
                Call Now
              </UIText>
            </UIButton>
          </View>
        </UIContainer>
      </ScrollView>
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
