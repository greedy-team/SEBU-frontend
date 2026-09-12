import { create } from "zustand";

export const useAuthStore = create((set) => ({
  // accessToken 제거 (쿠키로 관리)
  user: null,
  status: "loading",

  setAuth: (user) => set({ user, status: "authenticated" }), // accessToken 파라미터 제거

  clearAuth: () => set({ user: null, status: "anonymous" }),

  updateUser: (updatedUser) =>
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    })),
}));
