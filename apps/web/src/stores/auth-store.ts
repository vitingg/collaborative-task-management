import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type UserProperties } from "@collab-task-management/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProperties | null;
  isAuthenticated: boolean;

  login: (data: {
    token: string;
    refreshToken: string;
    user: UserProperties;
  }) => void;
  setToken: (token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (data) =>
        set({
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
          isAuthenticated: true,
        }),

      setToken: (token: string, refreshToken: string) =>
        set((state) => ({
          ...state,
          token,
          refreshToken: refreshToken ?? state.refreshToken,
        })),

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-store",
    }
  )
);
