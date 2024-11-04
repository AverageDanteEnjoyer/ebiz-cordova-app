import UserContext from "@/contexts/UserContext";
import { useRouter } from "@/i18n";
import { useEffect } from "react";
import { useContext } from "react";

export function useRedirectIfNotLoggedIn(path: string = "/login") {
  const { user, fetched } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (fetched && !user) {
      router.push(path);
    }
  }, [fetched, user, router, path]);
}
