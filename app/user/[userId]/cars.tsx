import { UIContainer, UIText } from "@/ui";
import { CarItem } from "@/ui/components/CarItem";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
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

type User = {
  id: string;
  name: string;
  avatar: string;
};

const mockUsers: Record<string, User> = {
  "1": {
    id: "1",
    name: "John Smith",
    avatar: "J",
  },
  "2": {
    id: "2",
    name: "Anna Kowalska",
    avatar: "A",
  },
  "3": {
    id: "3",
    name: "Michael Brown",
    avatar: "M",
  },
};

// Mock cars for each user
const mockUserCars: Record<string, Car[]> = {
  "1": [
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
      id: "4",
      brand: "BMW",
      model: "X5",
      year: 2022,
      price: 280000,
      mileage: 15000,
      fuelType: "Petrol",
      image: "https://via.placeholder.com/300x200",
      location: "Warsaw",
    },
    {
      id: "5",
      brand: "BMW",
      model: "118i",
      year: 2019,
      price: 95000,
      mileage: 62000,
      fuelType: "Petrol",
      image: "https://via.placeholder.com/300x200",
      location: "Warsaw",
    },
  ],
  "2": [
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
      id: "6",
      brand: "Mercedes-Benz",
      model: "E-Class",
      year: 2020,
      price: 220000,
      mileage: 38000,
      fuelType: "Diesel",
      image: "https://via.placeholder.com/300x200",
      location: "Krakow",
    },
  ],
  "3": [
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
    {
      id: "7",
      brand: "Audi",
      model: "A6",
      year: 2021,
      price: 195000,
      mileage: 25000,
      fuelType: "Petrol",
      image: "https://via.placeholder.com/300x200",
      location: "Wroclaw",
    },
    {
      id: "8",
      brand: "Audi",
      model: "Q5",
      year: 2020,
      price: 235000,
      mileage: 41000,
      fuelType: "Diesel",
      image: "https://via.placeholder.com/300x200",
      location: "Wroclaw",
    },
  ],
};

export default function UserCarsScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  const user = mockUsers[userId];
  const userCars = mockUserCars[userId] || [];

  if (!user) {
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
              User not found
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
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <UIText size="lg" color="white">
              {user.avatar}
            </UIText>
          </View>
          <View style={styles.headerText}>
            <UIText size="lg">{user.name}</UIText>
            <UIText size="xs" color="textSecondary">
              {userCars.length} {userCars.length === 1 ? "car" : "cars"} listed
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
