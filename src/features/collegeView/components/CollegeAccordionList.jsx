// features/collegeView/components/CollegeAccordionList.jsx
import CollegeAccordionItem from "./CollegeAccordionItem";

const colleges = [
  "경영대학",
  "공과대학",
  "생명과학대학",
  "소프트웨어융합대학",
  "전자정보공학대학",
]; // 자리만

function CollegeAccordionList() {
  return (
    <div className="flex flex-col gap-3">
      {colleges.map((name) => (
        <CollegeAccordionItem key={name} name={name} />
      ))}
    </div>
  );
}

export default CollegeAccordionList;
