import { Ionicons } from "@expo/vector-icons";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useUpdatePhoneNumber } from "../../api/userProfile";
import { UIBottomSheet, UIBottomSheetRef } from "../UIBottomSheet";
import { UIButton } from "../UIButton";
import { UIInput } from "../UIInput";
import { UIText } from "../UIText";

interface PhoneNumberModalProps {
  onClose: () => void;
}

export type { UIBottomSheetRef as PhoneNumberModalRef } from "../UIBottomSheet";

export const PhoneNumberModal = forwardRef<
  UIBottomSheetRef,
  PhoneNumberModalProps
>(({ onClose }, ref) => {
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useUpdatePhoneNumber();
  const bottomSheetRef = useRef<UIBottomSheetRef>(null);
  const { theme } = useUnistyles();

  useImperativeHandle(ref, () => bottomSheetRef.current!);

  const onPress = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    try {
      await mutateAsync({ phone_number: phone });
      bottomSheetRef.current?.dismiss();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UIBottomSheet
      ref={bottomSheetRef}
      onDismiss={onClose}
      enableDynamicSizing={true}
    >
      <View style={styles.container as StyleProp<ViewStyle>}>
        <View style={styles.header as StyleProp<ViewStyle>}>
          <View style={styles.iconContainer as StyleProp<ViewStyle>}>
            <Ionicons name="call" size={28} color={theme.colors.primary} />
          </View>
        </View>

        <View style={styles.body as StyleProp<ViewStyle>}>
          <UIText
            weight="bold"
            size="lg"
            style={styles.title as StyleProp<TextStyle>}
          >
            Phone Number
          </UIText>
          <UIText
            color="textSecondary"
            size="sm"
            style={styles.subtitle as StyleProp<TextStyle>}
          >
            Add your phone number so potential buyers can easily contact you
            about your listings.
          </UIText>

          <UIInput
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +48 123 456 789"
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer as StyleProp<ViewStyle>}
          />
        </View>

        <View style={styles.footer as StyleProp<ViewStyle>}>
          <UIButton
            variant="primary"
            onPress={onPress}
            style={
              [
                styles.submitBtn,
                !phone.trim() && { opacity: 0.6 },
              ] as StyleProp<ViewStyle>
            }
            disabled={!phone.trim() || loading}
          >
            <UIText color="white" weight="bold">
              {loading ? "Saving..." : "Save number"}
            </UIText>
          </UIButton>
        </View>
      </View>
    </UIBottomSheet>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  header: {
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
  },
}));
