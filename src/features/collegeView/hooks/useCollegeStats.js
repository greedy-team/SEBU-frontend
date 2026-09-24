import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLaboratories } from "../../../api/labApi";

export function useCollegeStats() {
  const { data: labs = [] } = useQuery({
    queryKey: ["laboratories"], // useLabFilter랑 같은 키!
    queryFn: fetchLaboratories,
    staleTime: 1000 * 60 * 60, // 1시간
  });

  const colleges = useMemo(() => {
    const collegeMap = new Map();

    labs.forEach((lab) => {
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
  }, [labs]);

  const totalColleges = colleges.length;
  const totalLabs = colleges.reduce((sum, c) => sum + c.totalLabs, 0);

  return { colleges, totalColleges, totalLabs };
}
