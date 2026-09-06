import { useErrorStore } from "../../store/errorStore";

function RateLimitToast() {
  const rateLimitError = useErrorStore((state) => state.rateLimitError);
  const clearRateLimitError = useErrorStore(
    (state) => state.clearRateLimitError,
  );

  if (!rateLimitError) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg">
      <p className="text-sm font-medium">
        요청이 너무 많습니다. {rateLimitError}초 후 다시 시도해주세요.
      </p>
      <button
        onClick={clearRateLimitError}
        className="text-white/70 hover:text-white"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}

export default RateLimitToast;
