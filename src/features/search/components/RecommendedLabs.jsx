import { useState, useMemo } from "react";
import { mockLabs } from "../../../mocks/mockLabs";
import ComingSoonModal from "../../../components/common/ComingSoonModal";
import { RECRUITMENT_STATUS } from "../../../constants/recruitmentStatus";

function RecommendedLabs() {
  const [selectedLab, setSelectedLab] = useState(null);

  const topLabs = useMemo(() => {
    return [...mockLabs]
      .filter((lab) => lab.recruitmentStatus !== "CLOSED")
      .sort((a, b) => b.bookmarkCount - a.bookmarkCount)
      .slice(0, 3);
  }, []);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-sm mb-3">인기 · 추천 연구실</h3>

        <div className="flex flex-col gap-2">
          {topLabs.map((lab, index) => {
            const status = RECRUITMENT_STATUS[lab.recruitmentStatus];
            return (
              <button
                key={lab.id}
                onClick={() => setSelectedLab(lab)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left w-full"
              >
                {/* 순위 번호 */}
                <span
                  className={`text-lg font-bold w-5 shrink-0 ${
                    index === 0
                      ? "text-yellow-400"
                      : index === 1
                        ? "text-gray-400"
                        : "text-amber-600"
                  }`}
                >
                  {index + 1}
                </span>

                {/* 연구실 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{lab.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {lab.college.name}
                  </p>
                </div>

                {/* 모집상태 */}
                <span className={`text-xs shrink-0 ${status.color}`}>
                  {status.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedLab && <ComingSoonModal onClose={() => setSelectedLab(null)} />}
    </>
  );
}

export default RecommendedLabs;
