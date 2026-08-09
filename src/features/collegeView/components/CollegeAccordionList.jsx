import { useCollegeStats } from "../hooks/useCollegeStats";
import CollegeAccordionItem from "./CollegeAccordionItem";

function CollegeAccordionList() {
  const { colleges } = useCollegeStats();

  return (
    <div className="flex flex-col gap-3">
      {colleges.map((college) => (
        <CollegeAccordionItem key={college.id} college={college} />
      ))}
    </div>
  );
}

export default CollegeAccordionList;
