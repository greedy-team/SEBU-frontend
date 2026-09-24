import { Link } from "react-router-dom";
//import { RECRUITMENT_STATUS } from "../../constants/recruitmentStatus";
import { useState } from "react";
import { addLabBookmark, removeLabBookmark } from "../../api/bookmarkApi";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";

function LabDetailModal({ lab, onClose }) {
  //const status = RECRUITMENT_STATUS[lab.recruitmentStatus];
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(lab.bookmarked ?? false);
  const [bookmarkCount, setBookmarkCount] = useState(lab.bookmarkCount ?? 0);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const buildGmailUrl = (email) => {
    const subject = encodeURIComponent(
      "[학부연구생 문의] 연구실 지원 관련 문의드립니다",
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`;
  };

  // 네이버 URL 확인 후 채택 여부 결정 — 확인 전까지는 주석 처리하거나 생략
  const buildNaverUrl = (email) => {
    return `https://mail.naver.com/v2/new?to=${encodeURIComponent(email)}`;
  };

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: (isBookmarked) =>
      isBookmarked ? removeLabBookmark(lab.id) : addLabBookmark(lab.id),

    // API 호출 전 낙관적 업데이트
    onMutate: (isBookmarked) => {
      const nextBookmarked = !isBookmarked;
      setBookmarked(nextBookmarked);
      setBookmarkCount((prev) => (nextBookmarked ? prev + 1 : prev - 1));
    },

    // 성공 시 MyPage 캐시 무효화
    onSuccess: (_, isBookmarked) => {
      const nextBookmarked = !isBookmarked;

      // laboratories 캐시에서 해당 연구실만 수정 (재요청 없음)
      queryClient.setQueryData(["laboratories"], (old) =>
        old?.map((l) =>
          l.id === lab.id
            ? {
                ...l,
                bookmarked: nextBookmarked,
                bookmarkCount: l.bookmarkCount + (nextBookmarked ? 1 : -1),
              }
            : l,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["mypage"] });
    },

    // 실패 시 롤백
    onError: (_, isBookmarked) => {
      setBookmarked(isBookmarked);
      setBookmarkCount((prev) => (isBookmarked ? prev + 1 : prev - 1));
    },
  });

  const handleBookmark = () => {
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    toggleBookmark(bookmarked);
  };
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto">
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
                <>
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

                  <div className="flex gap-2 mt-2">
                    <a
                      href={buildGmailUrl(lab.professor.email)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs font-medium bg-blue-50 text-blue-600 rounded-lg px-3 py-2 hover:bg-blue-100"
                    >
                      Gmail로 보내기
                    </a>
                    {
                      // 네이버 채택 시 아래 주석 해제
                      <a
                        href={buildNaverUrl(lab.professor.email)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-xs font-medium bg-green-50 text-green-600 rounded-lg px-3 py-2 hover:bg-green-100"
                      >
                        네이버 메일로 보내기
                      </a>
                    }
                  </div>
                </>
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
                <p className="text-sm text-gray-500">
                  홈페이지 링크가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 8. 하단 고정 - 랩실평가 + 북마크 */}
        <div className="bg-white px-6 pt-3 pb-4 flex flex-col gap-3">
          <Link
            to={`/community/labs/${lab.id}`}
            className="flex items-center justify-center gap-1.5 bg-brand-500 text-white text-sm font-medium rounded-lg py-2.5 hover:brightness-95 transition"
          >
            랩실 평가 보러가기
          </Link>

          <button
            onClick={handleBookmark}
            aria-label={bookmarked ? "북마크 해제" : "북마크"}
            className={`flex items-center justify-center gap-2 transition-colors ${
              bookmarked
                ? "text-brand-500 font-medium"
                : "text-gray-400 hover:text-brand-500"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <span className="text-sm">
              {bookmarked ? "북마크됨" : "북마크"} · {bookmarkCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LabDetailModal;
