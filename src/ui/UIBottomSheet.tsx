import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { forwardRef, memo, useCallback } from "react";
import { View } from "react-native";
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from "react-native-unistyles";
import { UIText } from "./UIText";

export type { BottomSheetModal as UIBottomSheetRef } from "@gorhom/bottom-sheet";

type UIBottomSheetProps = {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
} & BottomSheetModalProps;

const ThemedBottomSheetModal = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps
>((props, ref) => {
  const { theme } = useUnistyles();

  return (
    <BottomSheetModal
      {...props}
      ref={ref}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
      }}
      handleStyle={{
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.textTertiary,
        width: theme.s(56),
        height: theme.s(5),
        borderRadius: theme.borderRadius.full,
      }}
    />
  );
});

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
          contentContainerStyle={
            footer ? styles.scrollContentWithFooter : undefined
          }
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView
          style={footer ? styles.scrollContentWithFooter : undefined}
        >
          {children}
        </BottomSheetView>
      );

      return (
        <ThemedBottomSheetModal
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backdropComponent={renderBackdrop}
          footerComponent={footer ? renderFooter : undefined}
          ref={ref}
          enableDynamicSizing={props.enableDynamicSizing ?? true}
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
        </ThemedBottomSheetModal>
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
  footerContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  scrollContentWithFooter: {
    paddingBottom: theme.s(100),
  },
}));
