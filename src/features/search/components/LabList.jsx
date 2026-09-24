import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LabCard from "../../../components/common/LabCard";

const PAGE_SIZE = 20;

function LabListInner({ labs }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, labs.length));
    }
  }, [inView, labs.length]);

  const visibleLabs = labs.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-3">
      {visibleLabs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
      {visibleCount < labs.length && (
        <div ref={ref} className="py-4 text-center text-sm text-gray-400">
          불러오는 중이에요…
        </div>
      )}
    </div>
  );
}

function LabList({ labs }) {
  if (labs.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-10 text-center">
        조건에 맞는 연구실이 없어요.
      </p>
    );
  }

  return <LabListInner key={labs} labs={labs} />;
}

export default LabList;
