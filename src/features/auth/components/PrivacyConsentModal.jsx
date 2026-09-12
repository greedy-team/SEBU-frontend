import { useState } from "react";

const CONSENT_ITEMS = [
  {
    id: "terms",
    label: "서비스 이용약관 동의",
    required: true,
    content: "추후 내용 확정 예정",
  },
  {
    id: "privacy",
    label: "개인정보 처리방침 동의",
    required: true,
    content: "추후 내용 확정 예정",
  },
  {
    id: "sejong",
    label: "세종대학교 계정 인증 동의",
    required: true,
    content: "추후 내용 확정 예정",
  },
];

function PrivacyConsentModal({ onConfirm }) {
  const [checked, setChecked] = useState({
    terms: false,
    privacy: false,
    sejong: false,
  });
  const [expanded, setExpanded] = useState({});

  const allRequired = CONSENT_ITEMS.filter((item) => item.required).every(
    (item) => checked[item.id],
  );

  const handleAll = (e) => {
    const value = e.target.checked;
    setChecked(
      Object.fromEntries(CONSENT_ITEMS.map((item) => [item.id, value])),
    );
  };

  const handleOne = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-lg">서비스 이용 동의</h2>
          <p className="text-xs text-gray-400 mt-1">
            SEBU 서비스 이용을 위해 아래 항목에 동의해주세요.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* 전체 동의 */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={Object.values(checked).every(Boolean)}
              onChange={handleAll}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="font-bold text-sm">전체 동의</span>
          </label>

          <hr className="border-gray-100" />

          {/* 개별 항목 */}
          {CONSENT_ITEMS.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked[item.id]}
                    onChange={() => handleOne(item.id)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm">
                    {item.label}
                    {item.required && (
                      <span className="text-blue-500 text-xs ml-1">필수</span>
                    )}
                  </span>
                </label>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  {expanded[item.id] ? "접기" : "보기"}
                </button>
              </div>

              {expanded[item.id] && (
                <div className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4 leading-relaxed">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 동의 버튼 */}
        <div className="px-6 pb-6">
          <button
            onClick={onConfirm}
            disabled={!allRequired}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
              allRequired
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            동의하고 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyConsentModal;
