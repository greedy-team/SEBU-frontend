import { useEffect, useState } from "react";
import { fetchColleges } from "../api/mainApi";
import { fetchLaboratories } from "../../../api/labApi";

/**
 * GET /colleges 가 아직 구현되지 않은 동안 쓰는 대체 경로입니다. (명세 2절 "신규 구현 필요")
 * 연구실 목록의 affiliations로 같은 모양을 만들어 씁니다.
 * API가 배포되면 이 함수와 아래 catch 분기는 지워도 됩니다.
 */
function buildCollegesFromLabs(labs) {
  const map = new Map();

  labs.forEach((lab) => {
    (lab.affiliations ?? []).forEach(({ college, department }) => {
      if (!college) return;

      if (!map.has(college.id)) {
        map.set(college.id, {
          id: college.id,
          name: college.name,
          departments: new Map(),
          // 한 연구실이 같은 단과대에 여러 학과로 걸릴 수 있어 Set으로 중복을 없앱니다.
          labIds: new Set(),
        });
      }

      const entry = map.get(college.id);
      entry.labIds.add(lab.id);
      if (department) entry.departments.set(department.id, department);
    });
  });

  return [...map.values()]
    .map((entry) => {
      const departments = [...entry.departments.values()].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      return {
        id: entry.id,
        name: entry.name,
        laboratoryCount: entry.labIds.size,
        departmentCount: departments.length,
        departments,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function useColleges() {
  const [colleges, setColleges] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const data = await fetchColleges();
        if (ignore) return;
        setColleges(data);
        setStatus("success");
      } catch {
        try {
          const labs = await fetchLaboratories();
          if (ignore) return;
          setColleges(buildCollegesFromLabs(labs));
          setStatus("success");
        } catch {
          if (!ignore) setStatus("error");
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return { colleges, status };
}
