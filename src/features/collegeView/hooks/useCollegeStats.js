import { useMemo, useState, useEffect } from "react";
import { fetchLaboratories } from "../../../api/labApi";

export function useCollegeStats() {
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLaboratories();
        setLabs(data);
      } catch (error) {
        console.error("연구실 데이터를 불러오지 못했습니다.", error);
      }
    };
    loadData();
  }, []);

  const colleges = useMemo(() => {
    // 단과대 기준으로 group by
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

    // Map → 배열로 변환 + 통계 계산
    return [...collegeMap.values()].map((college) => {
      const departments = [...college.departments.values()];
      const allLabs = departments.flatMap((d) => d.labs);

      return {
        ...college,
        departments,
        totalLabs: allLabs.length,
        recruitingCount: allLabs.filter(
          // (참고) 여기도 "OPEN" 기준으로 합치려면 아까 배운 OR 조건을 쓸 수 있음.
          (lab) => lab.recruitmentStatus === "RECRUITING",
        ).length,
      };
    });
  }, [labs]);

  // 전체 통계
  const totalColleges = colleges.length;
  const totalLabs = colleges.reduce((sum, c) => sum + c.totalLabs, 0);
  const totalRecruiting = colleges.reduce(
    (sum, c) => sum + c.recruitingCount,
    0,
  );

  return { colleges, totalColleges, totalLabs, totalRecruiting };
}
