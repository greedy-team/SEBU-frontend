import CollegeAccordionItem from "./CollegeAccordionItem";

function CollegeAccordionList({ colleges }) {
  // props로 받기
  return (
    <div className="flex flex-col gap-3">
      {colleges.map((college) => (
        <CollegeAccordionItem key={college.id} college={college} />
      ))}
    </div>
  );
}

export default CollegeAccordionList;
