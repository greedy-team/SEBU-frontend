import { useMemo } from "react";
import { mockLabs } from "../../../mocks/mockLabs";

export function useCollegeStats() {
  const colleges = useMemo(() => {
    // 단과대 기준으로 group by
    const collegeMap = new Map();

    mockLabs.forEach((lab) => {
      const { college, department } = lab;

      if (!collegeMap.has(college.id)) {
        collegeMap.set(college.id, {
          ...college,
          departments: new Map(),
        });
      }

      const collegeEntry = collegeMap.get(college.id);

      if (!collegeEntry.departments.has(department.id)) {
        collegeEntry.departments.set(department.id, {
          ...department,
          labs: [],
        });
      }

      collegeEntry.departments.get(department.id).labs.push(lab);
    });

    // Map → 배열로 변환 + 통계 계산
    return [...collegeMap.values()].map((college) => {
      const departments = [...college.departments.values()];
      const allLabs = departments.flatMap((d) => d.labs);

      return {
        ...college,
        departments,
        totalLabs: allLabs.length,
        recruitingCount: allLabs.filter(
          (lab) => lab.recruitmentStatus === "RECRUITING",
        ).length,
      };
    });
  }, []);

  // 전체 통계
  const totalColleges = colleges.length;
  const totalLabs = colleges.reduce((sum, c) => sum + c.totalLabs, 0);
  const totalRecruiting = colleges.reduce(
    (sum, c) => sum + c.recruitingCount,
    0,
  );

  return { colleges, totalColleges, totalLabs, totalRecruiting };
}
