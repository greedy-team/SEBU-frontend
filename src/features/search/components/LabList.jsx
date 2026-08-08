import LabCard from "./LabCard";

function LabList({ labs }) {
  if (labs.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-10 text-center">
        조건에 맞는 연구실이 없어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {labs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
    </div>
  );
}

export default LabList;
