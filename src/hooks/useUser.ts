import { api } from "@/lib/api";
import { User } from "@/types";
import { useState, useEffect, useCallback } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [fetched, setFetched] = useState(false);

  const fetchUser = useCallback(() => {
    try {
      api.get("/users/me").then(async (res) => {
        if (res.ok) {
          setUser(await res.json());
        } else {
          setUser(null);
        }
        setFetched(true);
      });
    } catch {
      setUser(null);
      setFetched(true);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, setUser, fetched };
}
