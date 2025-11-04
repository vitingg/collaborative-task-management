import type { UserProperties } from "@collab-task-management/types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProperties | null;
  isAuthenticated: boolean;

  login: (data: {
    token: string;
    refresh: string;
    user: UserProperties;
  }) => void;
  setToken: (data: { token: string; refreshToken?: string }) => void;
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
          refreshToken: data.refresh,
          user: data.user,
          isAuthenticated: true,
        }),

      setToken: (data) =>
        set((state) => ({
          token: data.token,
          refreshToken: data.refreshToken ?? state.refreshToken,
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
