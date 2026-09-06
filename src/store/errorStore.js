import { create } from "zustand";

export const useErrorStore = create((set) => ({
  rateLimitError: null, // retryAfter 초 저장

  setRateLimitError: (retryAfter) => set({ rateLimitError: retryAfter }),
  clearRateLimitError: () => set({ rateLimitError: null }),
}));
