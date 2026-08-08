import LabCard from "./LabCard";
import { mockLabs } from "../data/mockLabs";
function LabList() {
  return (
    <div className="flex flex-col gap-3">
      {mockLabs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
    </div>
  );
}
export default LabList;
