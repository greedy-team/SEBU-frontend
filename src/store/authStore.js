import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  status: "loading", // loading | authenticated | anonymous

  setAuth: (accessToken, user) =>
    set({ accessToken, user, status: "authenticated" }),

  clearAuth: () => set({ accessToken: null, user: null, status: "anonymous" }),

  updateUser: (updatedUser) =>
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    })),
}));
