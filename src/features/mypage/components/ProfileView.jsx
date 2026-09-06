const GPA_BAND_LABEL = {
  GTE_3_0: "3.0 이상",
  GTE_3_5: "3.5 이상",
  GTE_4_0: "4.0 이상",
};

function ProfileView({ profile, onEdit }) {
  const { name, grade, major, gpaBand, introduction } = profile;

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
      {/* 이름 */}
      <div>
        <p className="text-xs text-gray-400 mb-1">이름</p>
        <p className="font-medium">{name}</p>
      </div>

      <hr className="border-gray-100" />

      {/* 학년 */}
      <div>
        <p className="text-xs text-gray-400 mb-1">학년</p>
        <p className="font-medium">{grade}학년</p>
      </div>

      <hr className="border-gray-100" />

      {/* 전공 */}
      <div>
        <p className="text-xs text-gray-400 mb-1">전공</p>
        <p className="font-medium">{major?.name}</p>
      </div>

      <hr className="border-gray-100" />

      {/* 성적 (GPA) */}
      <div>
        <p className="text-xs text-gray-400 mb-1">성적 (GPA)</p>
        <p className="font-medium">
          {gpaBand ? GPA_BAND_LABEL[gpaBand] : "미입력"}
        </p>
      </div>

      <hr className="border-gray-100" />

      {/* 소개사항 */}
      <div>
        <p className="text-xs text-gray-400 mb-1">소개사항</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {introduction || "미입력"}
        </p>
      </div>

      {/* 수정하기 버튼 */}
      <button
        onClick={onEdit}
        className="w-full mt-2 py-3 rounded-xl border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
      >
        수정하기
      </button>
    </div>
  );
}

export default ProfileView;
