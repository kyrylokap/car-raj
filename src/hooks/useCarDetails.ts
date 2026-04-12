import { useState, useEffect } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../api/auth";
import { useCarById } from "../api/car";
import { getOrCreateChatForCar } from "../api/chat";
import { useChangeFavorite, useIsCarFavorite } from "../api/favorites";
import { useUserPhoneNumber } from "../api/userProfile";
import { useQueryClient } from "@tanstack/react-query";

export function useCarDetails(carId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useUser();
  const currentUserId = user?.id;
  const { data: car, isLoading } = useCarById(carId);
  const { data: isFavorite } = useIsCarFavorite(carId);
  const { data: phoneNumber } = useUserPhoneNumber(car?.user_id);
  const { mutate: pressFavorite } = useChangeFavorite();
  const [isCarFavorite, setIsCarFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (isFavorite !== undefined) {
      setIsCarFavorite(isFavorite);
    }
  }, [isFavorite]);

  const handleToggleFavorite = () => {
    pressFavorite(carId);
    setIsCarFavorite((prev) => !prev);
  };

  const handleContactSeller = async () => {
    if (currentUserId === car?.user_id || !car || !currentUserId) {
      return;
    }
    try {
      const chat = await getOrCreateChatForCar(
        carId,
        car.user_id,
        currentUserId
      );
      queryClient.invalidateQueries({ queryKey: ["userChats", currentUserId] });
      router.push(`/chat/${chat.id}`);
    } catch (err) {
      console.error("Failed to open chat", err);
    }
  };

  const handleCall = () => {
    if (!phoneNumber) return;
    const phoneNumberUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneNumberUrl).catch((err) =>
      console.error("Error:", err)
    );
  };

  const formatCreatedTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSpecsWithIcons = () => {
    if (!car) return [];
    const createdTime = formatCreatedTime(car.created_at);
    return [
      { icon: "car-outline", label: "Brand", value: car.brand },
      { icon: "pricetag-outline", label: "Model", value: car.model },
      { icon: "calendar-outline", label: "Year", value: car.year },
      {
        icon: "speedometer-outline",
        label: "Mileage",
        value: car.mileage ? `${car.mileage} km` : "-",
      },
      {
        icon: "cash-outline",
        label: "Price",
        value: car.price ? `${car.price.toLocaleString()} PLN` : "-",
      },
      { icon: "flash-outline", label: "Fuel Type", value: car.fuel },
      {
        icon: "options-outline",
        label: "Transmission",
        value: car.transmission,
      },
      { icon: "color-palette-outline", label: "Color", value: car.color },
      { icon: "location-outline", label: "Location", value: car.location },
      { icon: "time-outline", label: "Created", value: createdTime },
    ];
  };

  return {
    car,
    isLoading,
    isCarFavorite,
    phoneNumber,
    currentUserId,
    handleToggleFavorite,
    handleContactSeller,
    handleCall,
    getSpecsWithIcons,
  };
}
