import { useState, useRef } from "react";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../../../store/authStore";
/**
 * 로그인 폼 카드.
 *
 * 스타일은 Figma를 따르고, 로직(검증·포커스 이동·에러 처리·로딩)은 기존 그대로예요.
 * 화면에 새로 추가된 건 비밀번호 표시 토글 하나입니다.
 */

function EyeIcon({ off }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 20 20 4" />}
    </svg>
  );
}

function LoginForm() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const studentIdRef = useRef(null);
  const passwordRef = useRef(null);

  const setAuth = useAuthStore((state) => state.setAuth);
  const { executeLogin, isLoading, errorInfo, clearError } = useLogin(setAuth);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading) return;

    executeLogin(studentId, password, (failType) => {
      if (failType === "studentId") studentIdRef.current.focus();
      if (failType === "password") passwordRef.current.focus();
      if (failType === "auth_failed") {
        setPassword("");
        studentIdRef.current.focus();
      }
    });
  };

  const fieldClass = (hasError) =>
    [
      "w-full rounded-control border px-4 py-3 text-[14px] outline-none transition-colors",
      "placeholder:text-gray-400",
      hasError
        ? "border-red-500 bg-red-50 focus:bg-white"
        : "border-gray-200 bg-white focus:border-brand-500",
    ].join(" ");

  const idError =
    errorInfo.field === "studentId" || errorInfo.field === "global";
  const pwError =
    errorInfo.field === "password" || errorInfo.field === "global";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-gray-100 bg-white p-6"
      style={{ boxShadow: "var(--shadow-widget)" }}
    >
      <div className="mb-5">
        <label
          htmlFor="studentId"
          className="mb-2 block text-[13px] font-bold text-gray-800"
        >
          포털 아이디 (학번)
        </label>
        <input
          id="studentId"
          ref={studentIdRef}
          type="text"
          autoComplete="username"
          placeholder="세종대 포털 아이디를 입력해주세요"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            clearError("studentId");
          }}
          className={fieldClass(idError)}
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2 block text-[13px] font-bold text-gray-800"
        >
          비밀번호
        </label>
        <div className="relative">
          <input
            id="password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            className={`${fieldClass(pwError)} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition-colors hover:text-gray-700"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            <EyeIcon off={showPassword} />
          </button>
        </div>
      </div>

      {errorInfo.message && (
        <p className="mb-4 px-1 text-[13px] font-medium text-red-500">
          {errorInfo.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={[
          "w-full rounded-control py-3.5 text-[14px] font-bold transition-all",
          isLoading
            ? "cursor-not-allowed bg-gray-300 text-white"
            : "bg-brand-500 text-white hover:brightness-95",
        ].join(" ")}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}

export default LoginForm;
