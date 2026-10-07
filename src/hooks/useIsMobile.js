import { useSyncExternalStore } from "react";

// Tailwind의 md(768px) 미만을 모바일로 본다
const MOBILE_QUERY = "(max-width: 767px)";

const subscribe = (callback) => {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
