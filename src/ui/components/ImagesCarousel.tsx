import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { usePathname } from "expo-router";
import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UICard } from "../UICard";
import { UIText } from "../UIText";

const pickImages = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    aspect: [5, 3],
    quality: 1,
    allowsMultipleSelection: true,
  });

  if (!result.canceled) {
    return result?.assets?.map((image) => image.uri);
  }
  return [];
};

export const ImagesCarousel = ({
  images,
  setImages,
  handleChangeImagesCount,
}: {
  images: string[];
  setImages?: React.Dispatch<React.SetStateAction<string[]>>;
  handleChangeImagesCount?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  const carouselRef = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const pathName = usePathname();
  const deleteImage = () => {
    if (!setImages) return;
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(currentIndex, 1);
      setCurrentIndex((ci) => {
        const next = Math.min(ci, updated.length - 1);
        carouselRef?.current?.scrollTo({ index: next, animated: true });
        return next;
      });
      return updated;
    });
    handleChangeImagesCount?.((prev) => prev - 1);
  };
  const handlePickImages = async () => {
    const newImages = await pickImages();
    setImages!((prev) => {
      handleChangeImagesCount!(images.length + newImages.length);
      const resultImages = [...prev, ...newImages];
      const firstPickedImage = prev.length;
      setCurrentIndex(firstPickedImage);
      carouselRef?.current?.scrollTo({
        index: firstPickedImage,
        animated: true,
      });
      return resultImages;
    });
  };

  return (
    <UICard style={styles.imageCard}>
      {pathName.includes("sell-vehicle") ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <UIText size="lg" style={styles.sectionTitle}>
              Images
            </UIText>
            <UIText size="xs" color="textSecondary" style={styles.hintText}>
              Add at least 4 images of your vehicle
            </UIText>
          </View>

          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={handlePickImages}
          >
            <Ionicons name="camera" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      ) : null}

      {images.length !== 0 ? (
        <View>
          <Carousel
            ref={carouselRef}
            loop={false}
            width={width}
            style={styles.imageContainer}
            data={images}
            onProgressChange={(_, absoluteProgress) => {
              const currentItemIndex = Math.round(absoluteProgress);
              setCurrentIndex(currentItemIndex);
            }}
            renderItem={({ item: imageUrl }) => (
              <Pressable
                style={{ flex: 1 }}
                onLongPress={() => {
                  setSelectedImage(imageUrl);

                  setModalVisible(true);
                }}
              >
                <Image
                  style={styles.imagePlaceholder}
                  source={{ uri: imageUrl }}
                  contentFit="contain"
                />
              </Pressable>
            )}
          />
          <UIText style={styles.currentImageText}>
            {currentIndex + 1} / {images?.length}
          </UIText>
          {setImages ? (
            <TouchableOpacity
              style={styles.trashContainer}
              onPress={deleteImage}
            >
              <Ionicons name="trash" color="red" size={24} />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      <Modal visible={modalVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, width: "100%" }}
            onPress={() => setModalVisible(false)}
          >
            {selectedImage && (
              <Image
                contentFit="contain"
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </UICard>
  );
};

const styles = StyleSheet.create((theme) => ({
  imageUploadButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  imageCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    gap: 10,
  },
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
