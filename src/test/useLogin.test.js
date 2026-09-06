import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLogin } from "../features/auth/hooks/useLogin";

// useNavigate, useLocation 모킹
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: null }),
}));

// sejongLogin 모킹
vi.mock("../features/auth/api/authApi", () => ({
  sejongLogin: vi.fn(),
}));

import { sejongLogin } from "../features/auth/api/authApi";

describe("useLogin 유효성 검증", () => {
  it("학번이 비어있으면 에러 표시", async () => {
    const setAuth = vi.fn();
    const onAuthFail = vi.fn();

    const { result } = renderHook(() => useLogin(setAuth));

    await act(async () => {
      await result.current.executeLogin("", "password123", onAuthFail);
    });

    expect(result.current.errorInfo.message).toBe("학번을 입력해주세요.");
    expect(result.current.errorInfo.field).toBe("studentId");
    expect(onAuthFail).toHaveBeenCalledWith("studentId");
  });

  it("비밀번호가 비어있으면 에러 표시", async () => {
    const setAuth = vi.fn();
    const onAuthFail = vi.fn();

    const { result } = renderHook(() => useLogin(setAuth));

    await act(async () => {
      await result.current.executeLogin("21012345", "", onAuthFail);
    });

    expect(result.current.errorInfo.message).toBe("비밀번호를 입력해주세요.");
    expect(result.current.errorInfo.field).toBe("password");
    expect(onAuthFail).toHaveBeenCalledWith("password");
  });

  it("로그인 실패 시 에러 표시", async () => {
    const setAuth = vi.fn();
    const onAuthFail = vi.fn();

    sejongLogin.mockResolvedValue({
      ok: false,
      result: {
        success: false,
        error: {
          code: "SEJONG_AUTH_FAILED",
          message: "학번 또는 비밀번호를 확인해주세요.",
        },
      },
    });

    const { result } = renderHook(() => useLogin(setAuth));

    await act(async () => {
      await result.current.executeLogin("0000", "wrong", onAuthFail);
    });

    expect(result.current.errorInfo.message).toBe("학번 또는 비밀번호를 확인해주세요.");
    expect(onAuthFail).toHaveBeenCalledWith("auth_failed");
  });

  it("로그인 성공 시 setAuth 호출", async () => {
    const setAuth = vi.fn();
    const onAuthFail = vi.fn();

    sejongLogin.mockResolvedValue({
      ok: true,
      result: {
        success: true,
        data: {
          accessToken: "fake-token",
          user: { id: 1, profileCompleted: true },
        },
      },
    });

    const { result } = renderHook(() => useLogin(setAuth));

    await act(async () => {
      await result.current.executeLogin("21012345", "password", onAuthFail);
    });

    expect(setAuth).toHaveBeenCalledWith("fake-token", { id: 1, profileCompleted: true });
  });
});
