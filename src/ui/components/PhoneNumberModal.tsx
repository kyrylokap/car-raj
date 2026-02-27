import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUpdatePhoneNumber } from "../../api/userProfile";
import { UIButton } from "../UIButton";
import { UIInput } from "../UIInput";
import { UIText } from "../UIText";

type PhoneNumberModalProps = {
  visible?: boolean;
  close: () => void;
};

export const PhoneNumberModal = ({
  visible = false,
  close,
}: PhoneNumberModalProps) => {
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { theme } = useUnistyles();
  const { mutateAsync } = useUpdatePhoneNumber();

  const onPress = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    await mutateAsync({ phone_number: phone });
    setLoading(false);
    close();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <TouchableWithoutFeedback onPress={close}>
        <View style={styles.overlay}>
          <BlurView
            intensity={Platform.OS === "ios" ? 20 : 100}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="call"
                      size={28}
                      color={theme.colors.primary}
                    />
                  </View>
                  <TouchableOpacity
                    hitSlop={15}
                    onPress={close}
                    style={styles.closeBtn}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.body}>
                  <UIText weight="bold" size="lg" style={styles.title}>
                    Phone Number
                  </UIText>
                  <UIText
                    color="textSecondary"
                    size="sm"
                    style={styles.subtitle}
                  >
                    Add your phone number so potential buyers can easily contact
                    you about your listings.
                  </UIText>

                  <UIInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="e.g. +48 123 456 789"
                    keyboardType="phone-pad"
                    containerStyle={styles.inputContainer}
                  />
                </View>

                <View style={styles.footer}>
                  <UIButton
                    variant="primary"
                    onPress={onPress}
                    style={[
                      styles.submitBtn,
                      !phone.trim() && { opacity: 0.6 },
                    ]}
                    disabled={!phone.trim() || loading}
                  >
                    <UIText color="white" weight="bold">
                      {loading ? "Saving..." : "Save number"}
                    </UIText>
                  </UIButton>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 0,
  },
  footer: {
    marginTop: theme.spacing.sm,
  },
  submitBtn: {
    paddingVertical: 14,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
}));
