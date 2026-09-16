import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { recoverAccount } from "../api/authApi";
import { useAuthStore } from "../../../store/authStore";

function RecoveryModal({ recoveryExpiresIn, recoverableUntil, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const expiresInMinutes = Math.ceil(recoveryExpiresIn / 60);

  const handleRecover = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { ok, result } = await recoverAccount();

      if (!ok || !result.success) {
        const errorCode = result?.error?.code;

        if (errorCode === "RECOVERY_TOKEN_INVALID") {
          setError("복구 요청이 만료됐어요. 다시 로그인해주세요.");
          return;
        }

        setError(
          result?.error?.message || "복구에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }

      // 복구 성공 → 로그인 처리
      setAuth(result.data.user);

      const from = location.state?.from;
      if (!from || from === "/login") {
        navigate("/");
      } else {
        navigate(from);
      }
    } catch {
      setError("서버와 연결할 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6">
        <h2 className="font-bold text-base mb-2">계정을 복구하시겠어요?</h2>
        <p className="text-sm text-gray-500 mb-1">
          이전에 탈퇴한 계정이 있어요.
        </p>
        <p className="text-sm text-gray-500 mb-1">
          복구 가능 기한:{" "}
          <span className="font-medium text-gray-700">
            {formatDate(recoverableUntil)}
          </span>
        </p>
        <p className="text-sm text-gray-400 mb-6">
          복구 요청은 {expiresInMinutes}분 안에 완료해야 해요.
        </p>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:text-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleRecover}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-brand-500 text-white text-sm font-medium hover:brightness-95 transition-all disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isLoading ? "복구 중..." : "계정 복구하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecoveryModal;
