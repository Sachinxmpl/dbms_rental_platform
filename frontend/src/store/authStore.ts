import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),
}));