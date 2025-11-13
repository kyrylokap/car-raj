import { supabase } from "@/api/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return user;
}

export const handleSignOut = async () => {
  try {
    await supabase.auth.signOut();

    await GoogleSignin.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
