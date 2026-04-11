import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { UIBottomSheet, UIBottomSheetRef } from "../UIBottomSheet";
import { UIText } from "../UIText";

export const SettingsSheet = forwardRef<UIBottomSheetRef, { onDismiss?: () => void }>(({ onDismiss }, ref) => {
  const bottomSheetRef = useRef<UIBottomSheetRef>(null);

  useImperativeHandle(ref, () => bottomSheetRef.current!);

  return (
    <UIBottomSheet
      ref={bottomSheetRef}
      title="Settings"
      onDismiss={onDismiss}
    >
      <View style={{ padding: 20 }}>
        <UIText>Quick settings placeholder. Use the full settings screen for more options.</UIText>
      </View>
    </UIBottomSheet>
  );
});
