import { supabase } from "@/api/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Get current session user
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // Subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup
    return () => listener.subscription.unsubscribe();
  }, []);

  return user;
}
