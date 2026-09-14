import { useState } from "react";

const GPA_BAND = [
  { value: null, label: "선택 안 함" },
  { value: "GTE_3_0", label: "3.0 이상" },
  { value: "GTE_3_5", label: "3.5 이상" },
  { value: "GTE_4_0", label: "4.0 이상" },
];

function ProfileForm({
  initialData = {},
  onSubmit,
  isLoading,
  introError,
  formError,
}) {
  const [grade, setGrade] = useState(initialData.grade || null);
  const [major] = useState(initialData.department?.name || "");
  const [gpaBand, setGpaBand] = useState(initialData.gpaBand || null);
  const [introduction, setIntroduction] = useState(
    initialData.introduction || "",
  );

  const isValid = grade;

  const handleSubmit = () => {
    onSubmit({
      grade,
      gpaBand,
      introduction: introduction.trim(),
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col gap-5">
      {formError && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">
          {formError}
        </p>
      )}

      {/* 이름 - 읽기 전용 */}
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
          이름
        </label>
        <div className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-400 cursor-not-allowed select-none">
          {initialData.name || "-"}
        </div>
      </div>

      {/* 학년 */}
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
          학년 <span className="text-blue-500 text-xs">필수</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((g) => (
            <button
              key={g}
              aria-pressed={grade === g}
              onClick={() => setGrade(g)}
              className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                grade === g
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {g}학년
            </button>
          ))}
        </div>
      </div>

      {/* 전공 - 읽기 전용 */}
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
          전공
        </label>
        <div className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-400 cursor-not-allowed select-none">
          {major || "-"}
        </div>
      </div>

      {/* 성적 (GPA) */}
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
          성적 (GPA){" "}
          <span className="text-gray-400 text-xs">선택 · 4.5만점 기준</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {GPA_BAND.map((item) => (
            <button
              key={item.label}
              aria-pressed={gpaBand === item.value}
              onClick={() => setGpaBand(item.value)}
              className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                gpaBand === item.value
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 자기소개 */}
      <div>
        <label
          htmlFor="introduction"
          className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1"
        >
          자기소개{" "}
          <span className="text-gray-400 text-xs">선택 · 최대 500자</span>
        </label>
        <textarea
          id="introduction"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="간단한 자기소개를 입력해주세요"
          maxLength={500}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm resize-none"
          aria-label="자기소개"
        />
        {introError && (
          <p className="text-xs text-red-500 mt-1">{introError}</p>
        )}
      </div>

      {/* 저장하기 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
          isValid && !isLoading
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? "저장 중..." : "저장하기"}
      </button>
      {!isValid && (
        <p className="text-xs text-gray-400 text-center -mt-3">
          학년은 필수 입력입니다.
        </p>
      )}
    </div>
  );
}

export default ProfileForm;
