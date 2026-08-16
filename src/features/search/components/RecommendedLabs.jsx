import { useState, useMemo, useEffect } from "react";
import { mockLabs } from "../../../mocks/mockLabs";
import ComingSoonModal from "../../../components/common/ComingSoonModal";
import { RECRUITMENT_STATUS } from "../../../constants/recruitmentStatus";

function RecommendedLabs() {
  const [selectedLab, setSelectedLab] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const topLabs = useMemo(() => {
    return [...mockLabs]
      .sort((a, b) => b.bookmarkCount - a.bookmarkCount)
      .slice(0, 5);
  }, []);

  // 접힌 상태일 때만 2.5초마다 롤링
  useEffect(() => {
    if (isExpanded || isHovered) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % topLabs.length);
        setIsAnimating(false);
      }, 400); // 애니메이션 지속시간
    }, 3000);

    return () => clearInterval(interval);
  }, [isExpanded, isHovered, topLabs.length]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">인기 · 추천 연구실</h3>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-gray-400 text-s hover:text-gray-600"
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>

        {/* 접힌 상태: 롤링 */}
        {!isExpanded && (
          <div
            className="overflow-hidden h-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              onClick={() => setSelectedLab(topLabs[currentIndex])}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left w-full transition-all duration-300 ${
                isAnimating
                  ? "opacity-0 -translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <span
                className={`text-lg font-bold w-5 shrink-0 ${
                  currentIndex === 0
                    ? "text-yellow-400"
                    : currentIndex === 1
                      ? "text-gray-400"
                      : "text-amber-600"
                }`}
              >
                {currentIndex + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {topLabs[currentIndex]?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {topLabs[currentIndex]?.college.name}
                </p>
              </div>
              <span
                className={`text-xs shrink-0 ${
                  RECRUITMENT_STATUS[topLabs[currentIndex]?.recruitmentStatus]
                    ?.color
                }`}
              >
                {
                  RECRUITMENT_STATUS[topLabs[currentIndex]?.recruitmentStatus]
                    ?.label
                }
              </span>
            </button>
          </div>
        )}

        {/* 펼친 상태: 전체 리스트 */}
        {isExpanded && (
          <div className="flex flex-col gap-2">
            {topLabs.map((lab, index) => {
              const status = RECRUITMENT_STATUS[lab.recruitmentStatus];
              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLab(lab)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left w-full"
                >
                  <span
                    className={`text-lg font-bold w-5 shrink-0 ${
                      index === 0
                        ? "text-yellow-400"
                        : index === 1
                          ? "text-gray-400"
                          : index === 2
                            ? "text-amber-600"
                            : "text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lab.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {lab.college.name}
                    </p>
                  </div>
                  <span className={`text-xs shrink-0 ${status.color}`}>
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedLab && <ComingSoonModal onClose={() => setSelectedLab(null)} />}
    </>
  );
}

export default RecommendedLabs;
