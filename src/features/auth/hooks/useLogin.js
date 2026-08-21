import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sejongLogin } from "../api/authApi";
import { useAuthStore } from "../../../store/authStore";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ message: "", field: null });

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

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

      setAuth(result.data.accessToken, result.data.user);

      if (result.data.user.profileCompleted) {
        navigate("/");
      } else {
        navigate("/mypage-setup");
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
