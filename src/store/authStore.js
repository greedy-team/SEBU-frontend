import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,

  setAuth: (accessToken, user) => set({ accessToken, user }),

  clearAuth: () => set({ accessToken: null, user: null }),

  // 프로필 저장 성공 후 user 정보 업데이트
  updateUser: (updatedUser) =>
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    })),
}));
