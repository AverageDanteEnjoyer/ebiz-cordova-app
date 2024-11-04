import { User } from "@/types";
import { createContext } from "react";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  fetched: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  fetched: false,
});

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;
