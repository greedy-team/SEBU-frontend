import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sejongLogin } from "../api/authApi";
import { useAuthStore } from "../../../store/authStore";

export const useLogin = ({ onNewUser, onRecoveryRequired } = {}) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ message: "", field: null });

  const navigate = useNavigate();
  const location = useLocation();

  const executeLogin = async (studentId, password, onAuthFail) => {
    if (!studentId.trim()) {
      setErrorInfo({ message: "학번을 입력해주세요.", field: "studentId" });
      onAuthFail("studentId");
      return;
    }
    if (!password.trim()) {
      setErrorInfo({ message: "비밀번호를 입력해주세요.", field: "password" });
      onAuthFail("password");
      return;
    }

    setIsLoading(true);
    setErrorInfo({ message: "", field: null });

    try {
      const { ok, result } = await sejongLogin(studentId, password);

      if (!ok || !result.success) {
        const errorCode = result.error?.code;

        // 탈퇴 후 복구 대기시간 미경과
        if (errorCode === "ACCOUNT_RECOVERY_COOLDOWN") {
          setErrorInfo({
            message:
              result.error?.message ||
              "아직 계정 복구 대기 시간이 지나지 않았습니다. 잠시 후 다시 시도해주세요.",
            field: "global",
          });
          return;
        }

        setErrorInfo({
          message: result.error?.message || "로그인에 실패했습니다.",
          field: "global",
        });
        if (errorCode === "SEJONG_AUTH_FAILED") onAuthFail("auth_failed");
        return;
      }

      const { loginStatus, user, recoveryExpiresIn, recoverableUntil } =
        result.data;

      // 복구 가능 상태
      if (loginStatus === "RECOVERY_REQUIRED") {
        onRecoveryRequired?.({ recoveryExpiresIn, recoverableUntil });
        return;
      }

      // 정상 로그인 (AUTHENTICATED)
      setAuth(user);

      if (user.isNewUser) {
        onNewUser?.();
        return;
      }

      const from = location.state?.from;
      if (!from || from === "/login") {
        navigate("/");
      } else {
        navigate(from);
      }
    } catch (error) {
      setErrorInfo({ message: "서버와 연결할 수 없습니다.", field: "global" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field) => {
    if (errorInfo.field === field) setErrorInfo({ message: "", field: null });
  };

  return { executeLogin, isLoading, errorInfo, clearError };
};
