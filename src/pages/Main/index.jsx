import Header from "../../components/layout/Header";
import HeroSection from "../../features/main/components/HeroSection";
import LabReviewHighlights from "../../features/main/components/LabReviewHighlights";
import CollegeSection from "../../features/main/components/CollegeSection";
import RecommendedLabs from "../../features/search/components/RecommendedLabs";
import { useColleges } from "../../features/main/hooks/useColleges";
import { useLaboratoriesQuery } from "../../api/queries/laboratories";

function MainPage() {
  const { colleges, status: collegeStatus } = useColleges();
  const { data: labs = [] } = useLaboratoriesQuery();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />

      <div className="border-t border-gray-100 bg-gray-50">
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
          {/* 두 카드의 세로 길이를 맞추려고 items-start를 쓰지 않는다 (기본값 stretch) */}
          <div className="grid gap-6 md:grid-cols-[1fr_340px]">
            <LabReviewHighlights />
            <RecommendedLabs
              labs={labs}
              defaultExpanded
              fillHeight
              collapsible={false}
            />
          </div>
        </section>

        <div className="pb-6">
          {/* 구분선은 화면 전체가 아니라 카드·제목과 같은 콘텐츠 폭에 맞춘다 */}
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="border-t border-gray-200" />
          </div>
          <CollegeSection colleges={colleges} status={collegeStatus} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
