import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/mypageApi";

export function useProfileForm(initialData = {}, updateUser, onSuccess) {
  const [introError, setIntroError] = useState("");
  const [formError, setFormError] = useState("");

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      updateUser({ profileCompleted: true });
      onSuccess(data);
    },
    onError: (error) => {
      const errorCode = error.response?.data?.error?.code;

      if (errorCode === "CONTENT_POLICY_VIOLATION") {
        setIntroError(
          error.response?.data?.error?.fieldErrors?.[0]?.message ||
            "자기소개에 사용할 수 없는 표현이 포함되어 있습니다.",
        );
        return;
      }

      if (
        errorCode === "RATE_LIMITED" ||
        errorCode === "CONTENT_MODERATION_UNAVAILABLE"
      ) {
        setFormError(
          error.response?.data?.error?.message || "잠시 후 다시 시도해주세요.",
        );
        return;
      }

      setFormError(
        error.response?.data?.error?.message || "저장에 실패했습니다.",
      );
    },
  });

  const handleSubmit = (formData) => {
    setIntroError("");
    setFormError("");
    mutate(formData);
  };

  return {
    isLoading,
    introError,
    formError,
    handleSubmit,
  };
}
