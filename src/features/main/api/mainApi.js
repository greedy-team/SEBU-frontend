import client from "../../../api/client";

/** 단과대학 목록. (명세 2절) */
export async function fetchColleges() {
  const response = await client.get("/colleges");
  return response.data.data.colleges ?? [];
}
