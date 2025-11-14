import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { StyleSheet } from "react-native-unistyles";
import { UIText } from "../UIText";

export const ImagesCarousel = ({
  images,
  setImages,
  handleDecrementImagesCount,
}: {
  images: string[];
  setImages?: React.Dispatch<React.SetStateAction<string[]>>;
  handleDecrementImagesCount: () => void;
}) => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  if (images.length === 0) {
    return <></>;
  }
  const deleteImage = () => {
    setImages!((prev) => {
      const updated = [...prev];
      updated.splice(currentIndex, 1);
      setCurrentIndex((ci) => Math.min(ci, updated.length - 1));
      return updated;
    });
    handleDecrementImagesCount();
  };

  return (
    <View>
      <Carousel
        loop={false}
        width={width}
        style={styles.imageContainer}
        data={images}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item: imageUrl }) => (
          <Image
            style={styles.imagePlaceholder}
            source={{ uri: imageUrl }}
            contentFit="contain"
          />
        )}
      />
      <UIText style={styles.currentImageText}>
        {currentIndex + 1} / {images?.length}
      </UIText>
      {setImages ? (
        <TouchableOpacity style={styles.trashContainer} onPress={deleteImage}>
          <Ionicons name="trash" color="red" size={24} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  trashContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.spacing.sm,
    position: "absolute",
    top: 8,
    right: 12,
  },
  imageContainer: {
    width: "100%",
    height: 240,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
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
}));
