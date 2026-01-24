import { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../api/auth";
import { supabase } from "../api/supabase";

type PresencePayload = {
  user_id: string;
  online_at: string;
};

export function useOnlineUsers() {
  const user = useUser();
  const userId = user?.id;

  const channelRef = useRef<RealtimeChannel | null>(null);
  const [onlineIds, setOnlineIds] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel("presence:online-users", {
      config: { presence: { key: userId } },
    });

    const updateFromState = () => {
      const state = channel.presenceState();
      setOnlineIds(Object.keys(state));
    };

    channel.on("presence", { event: "sync" }, updateFromState);
    channel.on("presence", { event: "join" }, updateFromState);
    channel.on("presence", { event: "leave" }, updateFromState);

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
      } satisfies PresencePayload);
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);

  const onlineUserIdSet = useMemo(() => new Set(onlineIds), [onlineIds]);
  const isOnlineByUserId = useCallback(
    (userId: string) => {
      return onlineUserIdSet.has(userId);
    },
    [onlineUserIdSet],
  );
  return {
    onlineUserIds: onlineIds,
    onlineUserIdSet,
    isOnlineByUserId,
  };
}
