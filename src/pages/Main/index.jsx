import Header from "../../components/layout/Header";
import HeroSection from "../../features/main/components/HeroSection";
import CollegeSection from "../../features/main/components/CollegeSection";
import FeatureSection from "../../features/main/components/FeatureSection";
import { useColleges } from "../../features/main/hooks/useColleges";

function MainPage() {
  const { colleges, status: collegeStatus } = useColleges();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />

      <div className="border-y border-gray-200 bg-gray-50">
        <CollegeSection colleges={colleges} status={collegeStatus} />
      </div>

      <FeatureSection />
    </div>
  );
}

export default MainPage;
