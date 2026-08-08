import { RECRUITMENT_STATUS } from "../../../constants/recruitmentStatus";

function LabCard({ lab }) {
  const { name, professor, college, department, recruitmentStatus, bookmarkCount, bookmarked } = lab;
  const status = RECRUITMENT_STATUS[recruitmentStatus];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:shadow-sm transition">
      <div>
        <div className="flex gap-2 text-xs text-gray-500 mb-1">
          <span className="bg-gray-100 px-2 py-0.5 rounded">{college.name}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded">{department.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base">{name}</h3>
          <span className={`text-xs font-medium ${status.color}`}>● {status.label}</span>
        </div>

        <p className="text-sm text-gray-500 mt-1">{professor.name} 교수</p>
      </div>

      <div className="flex flex-col items-end gap-1 text-gray-400 text-xs">
        <button aria-label="북마크">
          {bookmarked ? "★" : "☆"}
        </button>
        <span>{bookmarkCount}</span>
      </div>
    </div>
  );
}

export default LabCard;
