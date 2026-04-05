import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { usersApi } from "../api/client";

export function useAuth() {
  const { user, token, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    if (token) {
      usersApi
        .getMe()
        .then((u) => setUser(u))
        .catch(() => clearAuth());
    }
  }, [token]);

  return {
    user,
    token,
    isLoggedIn: !!token,
    clearAuth,
  };
}