import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sejongLogin } from "../api/authApi";
import { useAuthStore } from "../../../store/authStore";

export const useLogin = ({ onNewUser } = {}) => {
  // setAuth 파라미터 제거
  const setAuth = useAuthStore((state) => state.setAuth); // 내부에서 구독
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
        setErrorInfo({
          message: result.error?.message || "로그인에 실패했습니다.",
          field: "global",
        });
        if (errorCode === "SEJONG_AUTH_FAILED") onAuthFail("auth_failed");
        return;
      }

      setAuth(result.data.user); // accessToken 제거
      if (result.data.user.isNewUser) {
        onNewUser?.();
        return; // 페이지 이동 안 함
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
