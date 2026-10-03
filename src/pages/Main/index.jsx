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
          <div className="grid items-start gap-6 md:grid-cols-[1fr_340px]">
            <LabReviewHighlights />
            <RecommendedLabs labs={labs} defaultExpanded />
          </div>
        </section>

        <div className="border-t border-gray-200 pb-6">
          <CollegeSection colleges={colleges} status={collegeStatus} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
