import notifee from "@notifee/react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useUser } from "./auth";
import {
    initializeNotifications,
    setupMessageNotifications,
    setupNotificationHandlers,
} from "./notifications";


export function useNotifications() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      initializeNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribeMessages = setupMessageNotifications(
      user.id,
      (chatId) => {
        router.push(`/chat/${chatId}`);
      }
    );

    return () => {
      unsubscribeMessages();
    };
  }, [user?.id, router]);

  useEffect(() => {
    const unsubscribeForeground = setupNotificationHandlers((chatId) => {
      router.push(`/chat/${chatId}`);
    });

    notifee.getInitialNotification().then((initialNotification) => {
      if (initialNotification) {
        const chatId = initialNotification.notification.data?.chatId as string | undefined;
        if (chatId) {
          router.push(`/chat/${chatId}`);
        }
      }
    });

    return () => {
      unsubscribeForeground();
    };
  }, [router]);
}
