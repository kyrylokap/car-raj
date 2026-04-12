import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { forwardRef, memo, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
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

      const renderFooter = useCallback(
        (footerProps: BottomSheetFooterProps) => {
          if (!footer) return null;
          return (
            <BottomSheetFooter {...footerProps} bottomInset={0}>
              <BlurView
                intensity={50}
                tint={UnistylesRuntime.themeName === "dark" ? "dark" : "light"}
                style={styles.footerContainer}
              >
                {footer}
              </BlurView>
            </BottomSheetFooter>
          );
        },
        [footer],
      );

      const content = scrollable ? (
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={
            footer ? styles.scrollContentWithFooter : undefined
          }
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        <View style={footer ? styles.scrollContentWithFooter : undefined}>
          {children}
        </View>
      );

      return (
        <BottomSheetModal
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backdropComponent={renderBackdrop}
          footerComponent={footer ? renderFooter : undefined}
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
        </BottomSheetModal>
      );
    },
  ),
);

const styles = StyleSheet.create((theme) => ({
  header: {
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
  },
  scrollContentWithFooter: {
    paddingBottom: theme.s(100),
  },
}));
