import { useEffect, useState } from "react";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";

function ProfileModal({
  profile,
  onClose,
  onSubmit,
  isLoading,
  introError,
  formError,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    if (isEditing) {
      const confirmed = window.confirm(
        "변경사항이 저장되지 않습니다. 닫으시겠어요?",
      );
      if (confirmed) {
        setIsEditing(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 id="modal-title" className="font-bold text-base">
            내 정보
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-6">
          {isEditing ? (
            <ProfileForm
              initialData={profile}
              onSubmit={(formData) => {
                onSubmit(formData);
                setIsEditing(false);
              }}
              isLoading={isLoading}
              introError={introError}
              formError={formError}
            />
          ) : (
            <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
