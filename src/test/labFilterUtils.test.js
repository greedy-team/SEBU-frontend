import { describe, it, expect } from "vitest";
import {
  applySorting,
  applyFilters,
} from "../features/search/utils/labFilterUtils";

const mockLabs = [
  {
    id: "1",
    name: "AI연구실",
    professor: { name: "김교수" },
    college: { id: "1", name: "공과대학" },
    department: { name: "컴퓨터공학과" },
    recruitmentStatus: "RECRUITING",
    bookmarkCount: 50,
    createdAt: "2026-01-01",
  },
  {
    id: "2",
    name: "빅데이터랩",
    professor: { name: "이교수" },
    college: { id: "2", name: "경영대학" },
    department: { name: "경영학과" },
    recruitmentStatus: "ALWAYS_OPEN",
    bookmarkCount: 30,
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    name: "머신러닝랩",
    professor: { name: "박교수" },
    college: { id: "1", name: "공과대학" },
    department: { name: "전자공학과" },
    recruitmentStatus: "CLOSED",
    bookmarkCount: 80,
    createdAt: "2026-03-01",
  },
];

// applySorting 테스트
describe("applySorting", () => {
  it("인기순 정렬 - bookmarkCount 높은 순", () => {
    const result = applySorting(mockLabs, "POPULAR");
    expect(result[0].bookmarkCount).toBe(80);
    expect(result[1].bookmarkCount).toBe(50);
    expect(result[2].bookmarkCount).toBe(30);
  });

  it("이름 오름차순 정렬 - localeCompare 기준", () => {
    const result = applySorting(mockLabs, "NAME_ASC");
    const expected = [...mockLabs].sort((a, b) => a.name.localeCompare(b.name));
    expect(result[0].name).toBe(expected[0].name);
    expect(result[1].name).toBe(expected[1].name);
    expect(result[2].name).toBe(expected[2].name);
  });

  it("이름 내림차순 정렬 - localeCompare 기준", () => {
    const result = applySorting(mockLabs, "NAME_DESC");
    const expected = [...mockLabs].sort((a, b) => b.name.localeCompare(a.name));
    expect(result[0].name).toBe(expected[0].name);
    expect(result[1].name).toBe(expected[1].name);
    expect(result[2].name).toBe(expected[2].name);
  });

  it("최신순 정렬 - RECENT는 원본 순서 반환", () => {
    const result = applySorting(mockLabs, "RECENT");
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe(mockLabs[0].name);
    expect(result[1].name).toBe(mockLabs[1].name);
    expect(result[2].name).toBe(mockLabs[2].name);
  });
});

// applyFilters 테스트
describe("applyFilters", () => {
  it("단과대 필터 - 공과대학만", () => {
    const filters = { colleges: ["1"], recruitmentStatus: null };
    const result = applyFilters(mockLabs, filters, "");
    expect(result).toHaveLength(2);
    expect(result.every((lab) => lab.college.id === "1")).toBe(true);
  });

  it("모집상태 필터 - RECRUITING만", () => {
    const filters = { colleges: [], recruitmentStatus: "RECRUITING" };
    const result = applyFilters(mockLabs, filters, "");
    expect(result).toHaveLength(1);
    expect(result[0].recruitmentStatus).toBe("RECRUITING");
  });

  it("모집상태 필터 - OPEN (RECRUITING + ALWAYS_OPEN)", () => {
    const filters = { colleges: [], recruitmentStatus: "OPEN" };
    const result = applyFilters(mockLabs, filters, "");
    expect(result).toHaveLength(2);
  });

  it("검색어 필터 - 연구실 이름", () => {
    const filters = { colleges: [], recruitmentStatus: null };
    const result = applyFilters(mockLabs, filters, "AI");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("AI연구실");
  });

  it("검색어 필터 - 교수 이름", () => {
    const filters = { colleges: [], recruitmentStatus: null };
    const result = applyFilters(mockLabs, filters, "김교수");
    expect(result).toHaveLength(1);
    expect(result[0].professor.name).toBe("김교수");
  });

  it("필터 없으면 전체 반환", () => {
    const filters = { colleges: [], recruitmentStatus: null };
    const result = applyFilters(mockLabs, filters, "");
    expect(result).toHaveLength(3);
  });
});
