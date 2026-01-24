import React, { createContext, useContext } from "react";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

type OnlineUsersContextValue = {
  onlineUserIdSet: Set<string>;
  isOnlineByUserId: (userId: string) => boolean;
};

const OnlineUsersContext = createContext<OnlineUsersContextValue | null>(null);

export function OnlineUsersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onlineUserIdSet, isOnlineByUserId } = useOnlineUsers();

  return (
    <OnlineUsersContext.Provider value={{ onlineUserIdSet, isOnlineByUserId }}>
      {children}
    </OnlineUsersContext.Provider>
  );
}

export function useOnlineUsersContext() {
  const ctx = useContext(OnlineUsersContext);
  if (!ctx) {
    return {
      onlineUserIdSet: new Set<string>(),
      isOnlineByUserId: (_userId: string) => false,
    } satisfies OnlineUsersContextValue;
  }
  return ctx;
}
