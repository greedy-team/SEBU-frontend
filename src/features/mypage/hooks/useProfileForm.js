import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { updateProfile } from "../api/mypageApi";

export function useProfileForm(initialData = {}, onSuccess) {
  const [isLoading, setIsLoading] = useState(false);
  const [introError, setIntroError] = useState("");
  const [formError, setFormError] = useState("");

  const accessToken = useAuthStore((state) => state.accessToken);
  const updateUser = useAuthStore((state) => state.updateUser);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setIntroError("");
    setFormError("");

    try {
      const { ok, result } = await updateProfile(accessToken, formData);

      if (!ok) {
        const errorCode = result.error?.code;

        // 자기소개 정책 위반 (422) → 자기소개 아래 에러
        if (errorCode === "CONTENT_POLICY_VIOLATION") {
          setIntroError(
            result.error.fieldErrors?.[0]?.message ||
              "자기소개에 사용할 수 없는 표현이 포함되어 있습니다.",
          );
          return;
        }

        // 과도한 요청 (429), 시스템 장애 (503) → 폼 전체 에러
        if (
          errorCode === "RATE_LIMITED" ||
          errorCode === "CONTENT_MODERATION_UNAVAILABLE"
        ) {
          setFormError(result.error?.message || "잠시 후 다시 시도해주세요.");
          return;
        }

        // 그 외 에러
        setFormError(result.error?.message || "저장에 실패했습니다.");
        return;
      }

      // 성공 → authStore user 업데이트 + 부모에 알림
      updateUser({
        profileCompleted: true,
      });
      onSuccess(result.data); // 저장된 프로필 데이터 전달
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
