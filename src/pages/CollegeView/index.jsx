// pages/CollegeView/index.jsx
import Header from "../../components/layout/Header";
import PageHeader from "../../features/collegeView/components/PageHeader";
import CollegeAccordionList from "../../features/collegeView/components/CollegeAccordionList";

function CollegeView() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader />
        <div className="mt-6">
          <CollegeAccordionList />
        </div>
      </div>
    </div>
  );
}

export default CollegeView;
