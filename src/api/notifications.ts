import notifee, {
    AndroidImportance,
    AuthorizationStatus,
    EventType
} from "@notifee/react-native";
import { Platform } from "react-native";
import { supabase } from "./supabase";

export async function initializeNotifee() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log("Notification permissions granted");
    
    if (Platform.OS === "android") {
      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: "default",
      });
    }
    
    return true;
  } else {
    console.warn("Notification permissions denied");
    return false;
  }
}

export async function displayLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
) {
  try {
    const hasPermission = await initializeNotifee();
    if (!hasPermission) {
      return;
    }

    await notifee.displayNotification({
      title,
      body,
      data: data || {},
      android: {
        channelId: "default",
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: "default",
        },
      },
      ios: {
        sound: "default",
      },
    });
  } catch (error) {
    console.error("Error displaying notification:", error);
  }
}

export function setupMessageNotifications(
  userId: string,
  onNotificationPress?: (chatId: string) => void
) {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "message",
        filter: `sender_id=neq.${userId}`, 
      },
      async (payload) => {
        const newMessage = payload.new;
        
        const { data: chat } = await supabase
          .from("chat")
          .select("owner_id, customer_id")
          .eq("id", newMessage.chat_id)
          .single();

        if (!chat) return;

        const isForCurrentUser = 
          (chat.owner_id === userId && newMessage.sender_id === chat.customer_id) ||
          (chat.customer_id === userId && newMessage.sender_id === chat.owner_id);

        if (!isForCurrentUser) return;

        const { data: sender } = await supabase
          .from("user_details")
          .select("fullname")
          .eq("id", newMessage.sender_id)
          .single();

        const senderName = sender?.fullname || "Someone";

        await displayLocalNotification(
          senderName,
          newMessage.text,
          {
            chatId: newMessage.chat_id,
            messageId: newMessage.id,
            senderId: newMessage.sender_id,
          }
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function setupNotificationHandlers(onNotificationPress?: (chatId: string) => void) {
  return notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log("Notification dismissed", detail.notification);
        break;
      case EventType.PRESS:
        console.log("Notification pressed", detail.notification);
        const chatId = detail.notification?.data?.chatId as string | undefined;
        if (chatId && onNotificationPress) {
          onNotificationPress(chatId);
        }
        break;
    }
  });
}

export async function initializeNotifications() {
  try {
    await initializeNotifee();
  } catch (error) {
    console.error("Error initializing notifications:", error);
  }
}
