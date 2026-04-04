import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  updateUser: (partial) =>
    set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),
}));
