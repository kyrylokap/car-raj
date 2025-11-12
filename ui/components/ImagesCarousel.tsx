import { Image } from "expo-image";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { StyleSheet } from "react-native-unistyles";
import { UIText } from "../UIText";

export const ImagesCarousel = ({ images }: { images: string[] }) => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  if (images.length === 0) {
    return <></>;
  }

  return (
    <View>
      <Carousel
        loop={false}
        width={width}
        style={styles.imageContainer}
        data={images}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item: imageUrl }) => (
          <Image style={styles.imagePlaceholder} source={{ uri: imageUrl }} />
        )}
      />
      <UIText style={styles.currentImageText}>
        {currentIndex + 1} / {images?.length}
      </UIText>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
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
