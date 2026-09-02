import client from "./client";

export async function fetchLaboratories() {
  try {
    const response = await client.get("/laboratories");
    return response.data.data.laboratories;
  } catch (error) {
    throw new Error("연구실 목록을 불러오는데 실패했습니다.", { cause: error });
  }
}
