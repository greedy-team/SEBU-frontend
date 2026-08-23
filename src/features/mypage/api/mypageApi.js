export const getMyPage = async (accessToken) => {
  const response = await fetch("/api/v1/users/me/mypage", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  const result = await response.json();
  return { ok: response.ok, result };
};

export const updateProfile = async (accessToken, profileData) => {
  const response = await fetch("/api/v1/users/me/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({
      name: profileData.name,
      grade: profileData.grade,
      major: profileData.major,
      gpaBand: profileData.gpaBand,
      introduction: profileData.introduction,
    }),
  });

  const result = await response.json();
  return { ok: response.ok, result };
};
