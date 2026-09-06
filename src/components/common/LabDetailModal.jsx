import { RECRUITMENT_STATUS } from "../../constants/recruitmentStatus";
import { useState } from "react";

function LabDetailModal({ lab, onClose }) {
  const status = RECRUITMENT_STATUS[lab.recruitmentStatus];
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 원래대로
    });
  };
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 헤더 - 모집상태 + 닫기 */}
        <div className="flex items-center justify-end px-6 pt-6 pb-4">
          {/* <span
            className={`text-sm font-medium flex items-center gap-1.5 ${status.color}`}
          >
            ● {status.label}
          </span> */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-6 flex flex-col gap-5 pb-6">
          {/* 2. 타이틀 - 연구실명 + 소속 */}
          <div>
            <h2 className="text-2xl font-bold">{lab.name}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {lab.college.name} · {lab.department.name}
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* 3. 지도교수 */}
          <div>
            <p className="text-xs text-gray-400 mb-1">지도 교수</p>
            <p className="font-bold">{lab.professor.name} 교수</p>
          </div>

          {/* 연구원 구성 - 데이터 없어서 주석 처리 */}
          {/* <p className="text-sm text-gray-500">
            박사과정 {lab.phdCount}명 · 석사과정 {lab.masterCount}명
          </p> */}

          <hr className="border-gray-100" />

          {/* 4. 연구실 소개 - 데이터 없어서 주석 처리 */}
          {/* <div>
            <p className="text-xs text-gray-400 mb-1">연구실 소개</p>
            <p className="text-sm text-gray-700 leading-relaxed">{lab.description}</p>
          </div> */}

          {/* 5. 키워드 (researchFields) */}
          <div>
            <p className="text-xs text-gray-400 mb-2">키워드</p>
            <div className="flex flex-wrap gap-2">
              {lab.researchFields.map((field) => (
                <span
                  key={field}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />
          <div>
            <p className="text-xs text-gray-400 mb-2">컨택 이메일</p>
            {lab.professor.email ? (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-sm font-medium">
                  {lab.professor.email}
                </span>
                <button
                  onClick={() => handleCopyEmail(lab.professor.email)}
                  className={`text-xs flex items-center gap-1 transition ${
                    copied
                      ? "text-green-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {copied ? "✓ 복사됨" : "🗒 복사"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                컨택 이메일이 없습니다 직접 문의 부탁드립니다.
              </p>
            )}
          </div>

          {/* 7. 연구실 홈페이지 */}
          <div>
            <p className="text-xs text-gray-400 mb-2">연구실 홈페이지</p>
            {lab.websiteUrl ? (
              <a
                href={lab.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-3 text-blue-600 text-sm font-medium hover:bg-blue-100"
              >
                🔗 {lab.websiteUrl}
              </a>
            ) : (
              <p className="text-sm text-gray-500">홈페이지 링크가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 8. 하단 고정 - 북마크 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-center gap-2">
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
            <span className="text-xl">{lab.bookmarked ? "🔖" : "🔖"}</span>
            <span className="text-sm">북마크 · {lab.bookmarkCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LabDetailModal;
