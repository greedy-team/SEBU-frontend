import { useState, useRef } from "react";
import { useLogin } from "../hooks/useLogin";

function LoginForm() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const studentIdRef = useRef(null);
  const passwordRef = useRef(null);

  const { executeLogin, isLoading, errorInfo, clearError } = useLogin();

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

  return (
    <div className="w-full max-w-sm mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <input
            ref={studentIdRef}
            type="text"
            placeholder="학번"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              clearError("studentId");
            }}
            className={`px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-colors 
              ${
                errorInfo.field === "studentId" || errorInfo.field === "global"
                  ? "border-red-500 bg-red-50 focus:bg-white"
                  : "border-transparent focus:border-blue-500 focus:bg-white"
              }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <input
            ref={passwordRef}
            type="password"
            placeholder="포털 비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            className={`px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-colors 
              ${
                errorInfo.field === "password" || errorInfo.field === "global"
                  ? "border-red-500 bg-red-50 focus:bg-white"
                  : "border-transparent focus:border-blue-500 focus:bg-white"
              }`}
          />
        </div>

        {errorInfo.message && (
          <p className="text-sm font-medium text-red-500 px-1 mt-1">
            {errorInfo.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-2 font-bold py-3.5 rounded-xl transition-colors 
            ${isLoading ? "bg-gray-400 text-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
