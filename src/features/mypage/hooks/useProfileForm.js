import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/mypageApi";

export function useProfileForm(updateUser, onSuccess) {
  const [introError, setIntroError] = useState("");
  const [formError, setFormError] = useState("");

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      updateUser({ profileCompleted: true });
      onSuccess(data);
    },
    onError: (error) => {
      if (error.code === "CONTENT_POLICY_VIOLATION") {
        setIntroError(
          error.fieldErrors?.[0]?.message ||
            "자기소개에 사용할 수 없는 표현이 포함되어 있습니다.",
        );
        return;
      }
      setFormError(error.message);
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
