import { lazy, Suspense, useCallback, useState, useRef } from "react";
import { useLogin } from "../hooks/useLogin";
import RecoveryModal from "./RecoveryModal";

// 마크다운 렌더러가 들어 있어서, 이용약관·개인정보 안내를 누를 때만 불러온다.
const PrivacyNoticeModal = lazy(() => import("./PrivacyNoticeModal"));

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
  // 안내 창: null(닫힘) | "terms"(이용약관) | "privacy"(개인정보 수집·이용 안내)
  const [noticeType, setNoticeType] = useState(null);
  const closeNotice = useCallback(() => setNoticeType(null), []);
  const [recoveryInfo, setRecoveryInfo] = useState(null); // 복구 모달 정보
  // 이용약관·개인정보 수집·이용 동의: 기본은 미선택이고, 페이지에 들어올 때마다(= 로그인할 때마다) 다시 받는다
  const [agreed, setAgreed] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const studentIdRef = useRef(null);
  const passwordRef = useRef(null);
  const agreeRef = useRef(null);

  const { executeLogin, isLoading, errorInfo, clearError } = useLogin({
    onRecoveryRequired: ({ recoveryExpiresIn, recoverableUntil }) => {
      setRecoveryInfo({ recoveryExpiresIn, recoverableUntil });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    // 동의 없이는 버튼·엔터 어느 쪽으로도 학교 인증 요청을 보내지 않는다
    if (!agreed) {
      setConsentError(true);
      agreeRef.current?.focus();
      return;
    }
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
    <>
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

        {/* [필수] 이용약관 및 개인정보 수집·이용 동의. 약관·안내를 열기만 해서는 동의되지 않는다 */}
        <div className="mb-5">
          <label
            htmlFor="privacyAgree"
            className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-gray-700"
          >
            <input
              id="privacyAgree"
              ref={agreeRef}
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setConsentError(false);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-500"
            />
            <span>
              <span className="font-bold text-brand-500">[필수]</span> 이용약관
              및 개인정보 수집·이용 동의
            </span>
          </label>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 pl-[26px] text-xs">
            <button
              type="button"
              onClick={() => setNoticeType("terms")}
              className="font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-800"
            >
              이용약관 보기
            </button>
            <button
              type="button"
              onClick={() => setNoticeType("privacy")}
              className="font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-800"
            >
              개인정보 수집·이용 안내 보기
            </button>
          </div>
          {consentError && !agreed && (
            <p
              role="alert"
              className="mt-2 px-1 text-[13px] font-medium text-red-500"
            >
              이용약관 및 개인정보 수집·이용에 동의해 주세요.
            </p>
          )}
        </div>

        {errorInfo.message && (
          <p className="mb-4 px-1 text-[13px] font-medium text-red-500">
            {errorInfo.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          aria-disabled={!agreed}
          className={[
            "w-full rounded-control py-3.5 text-[14px] font-bold text-white transition-all",
            isLoading
              ? "cursor-not-allowed bg-gray-300"
              : agreed
                ? "bg-brand-500 hover:brightness-95"
                : "bg-gray-300",
          ].join(" ")}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {noticeType && (
        <Suspense fallback={null}>
          <PrivacyNoticeModal type={noticeType} onClose={closeNotice} />
        </Suspense>
      )}

      {recoveryInfo && (
        <RecoveryModal
          recoveryExpiresIn={recoveryInfo.recoveryExpiresIn}
          recoverableUntil={recoveryInfo.recoverableUntil}
          onCancel={() => setRecoveryInfo(null)}
        />
      )}
    </>
  );
}

export default LoginForm;
