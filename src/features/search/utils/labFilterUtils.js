const matchSearchTerm = (lab, term) => {
  if (!term) return true;
  return lab.name.includes(term) || lab.professor.name.includes(term);
};

const matchColleges = (lab, collegeIds) => {
  if (!collegeIds || collegeIds.length === 0) return true;
  return collegeIds.includes(lab.college.id);
};

const matchStatus = (lab, status) => {
  if (!status) return true;

  if (status === "OPEN") {
    return (
      lab.recruitmentStatus === "RECRUITING" ||
      lab.recruitmentStatus === "ALWAYS_OPEN"
    );
  }

  return lab.recruitmentStatus === status;
};

export const applyFilters = (labs, filters, searchTerm) => {
  return labs.filter(
    (lab) =>
      matchSearchTerm(lab, searchTerm) &&
      matchColleges(lab, filters.colleges) &&
      matchStatus(lab, filters.recruitmentStatus),
  );
};

export const applySorting = (labs, sortType) => {
  const copy = [...labs];
  switch (sortType) {
    case "POPULAR":
      return copy.sort((a, b) => b.bookmarkCount - a.bookmarkCount);
    case "NAME_ASC":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "NAME_DESC":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return copy;
  }
};
