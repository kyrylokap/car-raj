import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useUpdatePhoneNumber } from "../../api/userProfile";
import { UIButton } from "../UIButton";
import { UIInput } from "../UIInput";
import { UIText } from "../UIText";

interface PhoneNumberModalProps {
  visible?: boolean;
  close: () => void;
}

export const PhoneNumberModal = ({
  visible = false,
  close,
}: PhoneNumberModalProps) => {
  const [phone, setPhone] = useState<string>("");
  const { mutateAsync } = useUpdatePhoneNumber();
  const onPress = async () => {
    await mutateAsync({ phone_number: phone });
    close();
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={close}>
        <View style={styles.modalContent}>
          <UIInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <UIButton onPress={onPress}>
            <UIText> Submit</UIText>
          </UIButton>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.shadow,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: theme.colors.background,
    padding: theme.scale(20),
    borderRadius: theme.scale(10),
  },
}));
