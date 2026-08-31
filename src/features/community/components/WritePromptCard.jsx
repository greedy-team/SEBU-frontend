import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

function PencilIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function WritePromptCard() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = status === "authenticated";

  return (
    <div className="rounded-card border border-gray-200 bg-white p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-control bg-brand-50 text-brand-500">
        <PencilIcon />
      </span>

      <p className="mt-3 text-sm font-bold text-gray-900">
        나만의 꿀팁이 있나요?
      </p>
      <p className="mt-1 text-xs text-gray-400">
        {isAuthenticated
          ? "경험을 나누면 누군가에게 큰 도움이 돼요."
          : "로그인하고 직접 참여해보세요!"}
      </p>

      <Link
        to={isAuthenticated ? "/community/write" : "/login"}
        className="mt-4 flex h-11 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white transition-all hover:brightness-95"
      >
        ✍️ 글쓰기
      </Link>
    </div>
  );
}

export default WritePromptCard;
