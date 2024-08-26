import { create } from "zustand";
import type { UserWithAccounts } from "@/types/user.types";

type UserAuthStore = {
  user: UserWithAccounts | null;
  setUser: (user: UserWithAccounts) => void;
};

export const userAuthStore = create<UserAuthStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
