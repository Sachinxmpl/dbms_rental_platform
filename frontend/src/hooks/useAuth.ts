import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { usersApi } from "../api/client";

export function useAuth() {
  const { user, token, setAuth, clearAuth, updateUser } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      usersApi
        .getMe()
        .then((u) => updateUser(u))
        .catch(() => clearAuth());
    }
  }, [token ,user, clearAuth , updateUser]);

  return { user, token, isLoggedIn: !!token, setAuth, clearAuth };
}
