import { useState } from "react";
import { updateProfile } from "../api/mypageApi";

export function useProfileForm(
  initialData = {},
  updateUser, // accessToken 제거
  onSuccess,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [introError, setIntroError] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setIntroError("");
    setFormError("");

    try {
      const { ok, result } = await updateProfile(formData); // accessToken 제거

      if (!ok) {
        const errorCode = result.error?.code;

        if (errorCode === "CONTENT_POLICY_VIOLATION") {
          setIntroError(
            result.error.fieldErrors?.[0]?.message ||
              "자기소개에 사용할 수 없는 표현이 포함되어 있습니다.",
          );
          return;
        }

        if (
          errorCode === "RATE_LIMITED" ||
          errorCode === "CONTENT_MODERATION_UNAVAILABLE"
        ) {
          setFormError(result.error?.message || "잠시 후 다시 시도해주세요.");
          return;
        }

        setFormError(result.error?.message || "저장에 실패했습니다.");
        return;
      }

      updateUser({ profileCompleted: true });
      onSuccess(result.data);
    } catch (err) {
      setFormError("서버와 연결할 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    introError,
    formError,
    handleSubmit,
  };
}
