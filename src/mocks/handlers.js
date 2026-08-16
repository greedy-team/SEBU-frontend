import { http, HttpResponse } from "msw";
import { mockLabs } from "./mockLabs";

export const handlers = [
  http.get("/api/v1/laboratories", () => {
    return HttpResponse.json({
      success: true,
      data: { laboratories: mockLabs },
      error: null,
    });
  }),
];
