import Header from "../../components/layout/Header";
import PageHeader from "../../features/collegeView/components/PageHeader";
import CollegeAccordionList from "../../features/collegeView/components/CollegeAccordionList";
import { useCollegeStats } from "../../features/collegeView/hooks/useCollegeStats";

function CollegeView() {
  const { totalColleges, totalLabs, totalRecruiting } = useCollegeStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader
          totalColleges={totalColleges}
          totalLabs={totalLabs}
          totalRecruiting={totalRecruiting}
        />
        <div className="mt-6">
          <CollegeAccordionList />
        </div>
      </div>
    </div>
  );
}

export default CollegeView;
