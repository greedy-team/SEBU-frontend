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
  const [name, setName] = useState(initialData.name || "");
  const [grade, setGrade] = useState(initialData.grade || null);
  const [major, setMajor] = useState(initialData.major?.name || "");
  const [gpaBand, setGpaBand] = useState(initialData.gpaBand || null);
  const [introduction, setIntroduction] = useState(
    initialData.introduction || "",
  );

  // 필수값 모두 입력됐는지 확인
  const isValid = name.trim() && grade && major.trim();

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      grade,
      major: major.trim(),
      gpaBand,
      introduction: introduction.trim(),
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col gap-5">
      {/* 폼 전체 에러 (429, 503) - props로 받음 */}
      {formError && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">
          {formError}
        </p>
      )}

      {/* 이름 */}
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
          이름 <span className="text-blue-500 text-xs">필수</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          maxLength={30}
          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm"
        />
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

      {/* 전공 */}
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
          전공 <span className="text-blue-500 text-xs">필수</span>
        </label>
        <input
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="스마트기기공학전공"
          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm"
        />
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

      {/* 소개사항 */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          소개사항{" "}
          <span className="text-gray-400 text-xs">
            연구 관심 분야, 보유 기술 등
          </span>
        </label>
        <textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="안녕하세요. 머신러닝과 컴퓨터 비전에 관심이 많은 3학년 학생입니다..."
          maxLength={500}
          rows={5}
          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm resize-none"
        />
        {/* 자기소개 에러 (422) - props로 받음 */}
        {introError && (
          <p className="text-xs text-red-500 mt-1">{introError}</p>
        )}
        <p className="text-xs text-gray-400 text-right mt-1">
          {introduction.length} / 500
        </p>
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
          이름, 학년, 전공은 필수 입력입니다.
        </p>
      )}
    </div>
  );
}

export default ProfileForm;
