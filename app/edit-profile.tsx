import {
  UIButton,
  UICard,
  UIContainer,
  UIInput,
  UIText,
} from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

export default function EditProfileScreen() {
  const { theme, rt } = useUnistyles();
  const styles = stylesheet;
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileForm>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+48 123 456 789",
    location: "Warsaw, Poland",
    bio: "",
  });

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      // Show error - in a real app you'd show a toast or alert
      return;
    }

    // Handle form submission
    // In a real app, this would send data to an API
    console.log("Profile updated:", formData);

    // Navigate back
    router.back();
  };

  const isFormValid = () => {
    return formData.firstName && formData.lastName && formData.email;
  };

  const getInitials = () => {
    const first = formData.firstName.charAt(0) || "";
    const last = formData.lastName.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <UIText size="xl" weight="bold" style={styles.headerTitle}>
          Edit Profile
        </UIText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: rt.insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <UIContainer>
          {/* Avatar Section */}
          <UICard variant="elevated" style={styles.avatarCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <UIText size="xxl" color="white" weight="bold">
                    {getInitials()}
                  </UIText>
                </View>
                <TouchableOpacity
                  style={styles.editAvatarButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="camera"
                    size={16}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </View>
              <UIText size="sm" color="textSecondary" style={styles.avatarHint}>
                Tap to change profile photo
              </UIText>
            </View>
          </UICard>

          {/* Personal Information */}
          <UICard variant="elevated" style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              Personal Information
            </UIText>

            <View style={styles.row}>
              <UIInput
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
                containerStyle={styles.halfInput}
              />
              <UIInput
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
                containerStyle={styles.halfInput}
              />
            </View>

            <UIInput
              label="Email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <UIInput
              label="Phone Number"
              placeholder="+48 123 456 789"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
            />

            <UIInput
              label="Location"
              placeholder="Warsaw, Poland"
              value={formData.location}
              onChangeText={(text) => handleInputChange("location", text)}
            />
          </UICard>

          {/* About Section */}
          <UICard variant="elevated" style={styles.formCard}>
            <UIText size="lg" style={styles.sectionTitle}>
              About
            </UIText>
            <UIInput
              placeholder="Tell us about yourself... (optional)"
              value={formData.bio}
              onChangeText={(text) => handleInputChange("bio", text)}
              multiline
              numberOfLines={6}
              style={styles.bioInput}
            />
          </UICard>

          {/* Verified Badge Info */}
          <UICard variant="outlined" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.primary}
              />
              <View style={styles.infoContent}>
                <UIText size="sm" weight="semibold">
                  Verified Account
                </UIText>
                <UIText size="xs" color="textSecondary">
                  Your account is verified. Contact support to change
                  verification status.
                </UIText>
              </View>
            </View>
          </UICard>

          {/* Submit Button */}
          <View style={styles.actionButtons}>
            <UIButton
              variant="outline"
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <UIText size="default" weight="semibold">
                Cancel
              </UIText>
            </UIButton>
            <UIButton
              variant="primary"
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={!isFormValid()}
            >
              <UIText size="default" color="white" weight="semibold">
                Save Changes
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  avatarCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  avatarSection: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: `${theme.colors.primary}20`,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  avatarHint: {
    marginTop: theme.spacing.xs,
  },
  formCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  halfInput: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  bioInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  infoCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
}));
