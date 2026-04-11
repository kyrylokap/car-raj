import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, memo, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIText } from "./UIText";

export type { BottomSheetModal as UIBottomSheetRef } from "@gorhom/bottom-sheet";

type UIBottomSheetProps = {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
} & BottomSheetModalProps;

export const UIBottomSheet = memo(
  forwardRef<BottomSheetModal, UIBottomSheetProps>(
    ({ children, title, footer, scrollable = true, ...props }, ref) => {
      const renderBackdrop = useCallback(
        (backdropProps: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
            pressBehavior="close"
          />
        ),
        [],
      );

      const content = scrollable ? (
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        children
      );

      return (
        <BottomSheetModal
          backdropComponent={renderBackdrop}
          handleStyle={styles.handleStyle}
          backgroundStyle={styles.backgroundStyle}
          ref={ref}
          enableDynamicSizing={props.enableDynamicSizing ?? true}
          handleIndicatorStyle={styles.handleIndicatorStyle}
          {...props}
        >
          {title != null && (
            <View style={styles.headerView}>
              {typeof title === "string" ? (
                <UIText size="xl" weight="bold" style={styles.header}>
                  {title}
                </UIText>
              ) : (
                title
              )}
            </View>
          )}

          {content}

          {footer && <View style={styles.footerContainer}>{footer}</View>}
        </BottomSheetModal>
      );
    },
  ),
);

const styles = StyleSheet.create((theme) => ({
  header: {
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerView: {
    paddingTop: theme.s(16),
    paddingBottom: theme.spacing.sm,
    width: "100%",
    alignItems: "center",
  },
  handleStyle: {
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.background,
  },
  backgroundStyle: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  handleIndicatorStyle: {
    backgroundColor: theme.colors.borderDark,
    width: theme.s(56),
    height: theme.s(5),
    borderRadius: theme.borderRadius.full,
  },
  footerContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 0,
    backgroundColor: "transparent",
  },
}));

