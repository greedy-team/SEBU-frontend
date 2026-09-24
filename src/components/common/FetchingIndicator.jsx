import { useIsFetching } from "@tanstack/react-query";

function FetchingIndicator() {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <div className="fixed top-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-800/70 px-4 py-1.5 text-xs text-white">
      업데이트 중이에요…
    </div>
  );
}

export default FetchingIndicator;
