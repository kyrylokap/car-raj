import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
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
  onImagesChange,
  hero = false,
}: {
  images: string[];
  setImages?: React.Dispatch<React.SetStateAction<string[]>>;
  onImagesChange?: (count: number) => void;
  hero?: boolean;
}) => {
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  const carouselRef = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    onImagesChange?.(images.length - 1);
  };
  const handlePickImages = async () => {
    const newImages = await pickImages();
    setImages!((prev) => {
      const resultImages = [...prev, ...newImages];
      onImagesChange?.(resultImages.length);
      const firstPickedImage = prev.length;
      setCurrentIndex(firstPickedImage);
      carouselRef?.current?.scrollTo({
        index: firstPickedImage,
        animated: true,
      });
      return resultImages;
    });
  };

  const carouselContent =
    images.length !== 0 ? (
      <View>
        <Carousel
          ref={carouselRef}
          loop={false}
          width={width}
          style={hero ? styles.heroImageContainer : styles.imageContainer}
          data={images}
          onSnapToItem={(index) => setCurrentIndex(index)}
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
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={100}
                placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                priority="high"
                recyclingKey={imageUrl}
                allowDownscaling={true}
              />
            </Pressable>
          )}
        />
        <UIText
          style={hero ? styles.heroCurrentImageText : styles.currentImageText}
        >
          {currentIndex + 1} / {images?.length}
        </UIText>
        {setImages ? (
          <TouchableOpacity style={styles.trashContainer} onPress={deleteImage}>
            <Ionicons name="trash" color="red" size={24} />
          </TouchableOpacity>
        ) : null}
      </View>
    ) : null;

  if (hero) {
    return (
      <>
        {carouselContent}
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
                  cachePolicy="memory-disk"
                  transition={200}
                  priority="high"
                />
              )}
            </TouchableOpacity>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <View style={styles.imageSection}>
      {setImages ? (
        <View style={styles.sectionHeader}>
          <View>
            <UIText size="md" weight="semibold" style={styles.sectionTitle}>
              Vehicle Photos
            </UIText>
            <UIText size="xs" color="textSecondary" style={styles.hintText}>
              Add at least 4 photos
            </UIText>
          </View>

          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={handlePickImages}
          >
            <Ionicons name="camera" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      ) : null}

      {images.length === 0 && setImages ? (
        <TouchableOpacity
          style={styles.emptyStateContainer}
          onPress={handlePickImages}
          activeOpacity={0.7}
        >
          <Ionicons
            name="images-outline"
            size={48}
            color={theme.colors.textSecondary}
            style={{ opacity: 0.5 }}
          />
          <UIText
            weight="medium"
            color="textSecondary"
            style={{ marginTop: 12 }}
          >
            Tap to select photos
          </UIText>
        </TouchableOpacity>
      ) : images.length > 0 ? (
        <View style={styles.carouselWrapper}>{carouselContent}</View>
      ) : null}

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.95)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, width: "100%", justifyContent: "center" }}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          >
            {selectedImage && (
              <Image
                contentFit="contain"
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "80%" }}
                cachePolicy="memory-disk"
                transition={200}
                priority="high"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  imageSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontSize: 13,
  },
  hintText: {
    marginTop: 2,
    opacity: 0.8,
  },
  imageUploadButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateContainer: {
    height: theme.vs(180),
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  carouselWrapper: {
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  trashContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: theme.s(36),
    height: theme.s(36),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.full,
    position: "absolute",
    top: theme.s(12),
    right: theme.s(12),
  },
  imageContainer: {
    width: "100%",
    height: theme.vs(240),
    justifyContent: "center",
  },
  heroImageContainer: {
    width: "100%",
    height: theme.vs(320),
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
    bottom: theme.s(8),
    right: theme.s(12),
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    paddingHorizontal: theme.s(8),
    paddingVertical: theme.vs(4),
    borderRadius: theme.s(12),
    fontSize: theme.s(14),
  },
  heroCurrentImageText: {
    position: "absolute",
    bottom: theme.s(38),
    right: theme.s(12),
    backgroundColor: "rgba(0,0,0,0.55)",
    color: "#fff",
    paddingHorizontal: theme.s(10),
    paddingVertical: theme.vs(5),
    borderRadius: theme.s(14),
    fontSize: theme.s(13),
    fontWeight: "600",
  },
}));
