import { useEffect, useRef } from "react";

/**
 * 목록 화면의 스크롤 위치를 기억했다가 돌아왔을 때 되돌립니다.
 *
 * 상세로 들어가면 목록이 언마운트되고, 돌아올 때는 로딩 중이라 문서가 짧아서
 * 브라우저가 스크롤을 0으로 밀어버립니다. 그래서 목록이 다 그려진 뒤에
 * 되돌려야 하고, isReady가 그 시점을 알려줘요.
 *
 * 새로고침하면 사라져도 되는 값이라 메모리에만 둡니다.
 */
const positions = new Map();

export function useScrollRestore(key, isReady) {
  const hasRestored = useRef(false);

  useEffect(() => {
    const save = () => positions.set(key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [key]);

  useEffect(() => {
    // 한 번만 되돌립니다. 탭이나 검색어를 바꿔서 다시 로딩될 때까지
    // 되돌리면 사용자가 방금 한 행동을 덮어쓰게 돼요.
    if (hasRestored.current || !isReady) return;
    hasRestored.current = true;

    const saved = positions.get(key);
    if (!saved) return;

    // 목록이 그려진 다음 프레임에 옮겨야 위치가 맞습니다.
    const frame = requestAnimationFrame(() => window.scrollTo(0, saved));
    return () => cancelAnimationFrame(frame);
  }, [key, isReady]);
}
