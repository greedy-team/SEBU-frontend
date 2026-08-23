function ProfileHeader({ name, grade, profileCompleted }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* 프로필 이미지 (디자인만, 기능 미구현) */}
      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
        <span className="text-white text-xl font-bold">
          {name ? name[0] : "?"}
        </span>
      </div>

      {/* 이름 + 학년 */}
      <div>
        <p className="font-bold text-lg">
          {profileCompleted ? name : "이름을 입력해주세요"}
        </p>
        <p className="text-sm text-gray-400">{grade ? `${grade}학년` : ""}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;
