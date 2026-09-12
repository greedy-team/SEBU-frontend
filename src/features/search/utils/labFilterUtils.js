const matchSearchTerm = (lab, term) => {
  const keyword = (term ?? "").trim().toLowerCase();
  if (!keyword) return true;
  return (
    lab.name.toLowerCase().includes(keyword) ||
    lab.professor.name.toLowerCase().includes(keyword) ||
    (lab.researchFields ?? []).some((field) =>
      field.toLowerCase().includes(keyword),
    )
  );
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

const matchResearch = (lab, categoryIds, fieldIds) => {
  if (fieldIds.length > 0) {
    const labFieldIds = (lab.researchFieldDetails ?? []).map(
      (f) => f.researchFieldId,
    );
    return fieldIds.some((id) => labFieldIds.includes(id));
  }
  if (categoryIds.length > 0) {
    const labCategoryIds = lab.researchFieldCategoryIds ?? [];
    return categoryIds.some((id) => labCategoryIds.includes(id));
  }
  return true;
};

export const applyFilters = (labs, filters, searchTerm) => {
  return labs.filter(
    (lab) =>
      matchSearchTerm(lab, searchTerm) &&
      matchColleges(lab, filters.colleges) &&
      matchStatus(lab, filters.recruitmentStatus) &&
      matchResearch(lab, filters.categoryIds ?? [], filters.fieldIds ?? []),
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
