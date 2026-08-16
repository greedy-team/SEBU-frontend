import { http, HttpResponse, delay } from "msw";
import { mockLabs } from "./mockLabs";

export const handlers = [
  http.get("/api/v1/laboratories", () => {
    return HttpResponse.json({
      success: true,
      data: { laboratories: mockLabs },
      error: null,
    });
  }),

  http.post("/api/v1/auth/sejong/login", async () => {
    await delay(1000);

    return HttpResponse.json(
      {
        success: true,
        data: {
          accessToken: "fake-jwt-token-12345",
          tokenType: "Bearer",
          expiresIn: 1800,
          user: {
            id: 17,
            isNewUser: true,
            profileCompleted: true,
          },
        },
      },
      { status: 200 },
    );
  }),
];
