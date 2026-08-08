// 실제 백엔드 연결 시 사용할 API 함수
// baseURL은 나중에 .env로 뺄 예정 (예: import.meta.env.VITE_API_BASE_URL)

export async function fetchLaboratories() {
  const response = await fetch("/api/laboratories");

  if (!response.ok) {
    throw new Error("연구실 목록을 불러오는데 실패했습니다.");
  }

  const json = await response.json();
  return json.data.laboratories; // { success, data: { laboratories }, error } 구조 기준
}
