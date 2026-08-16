export const sejongLogin = async (studentId, password) => {
  const response = await fetch("/api/v1/auth/sejong/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ studentId, password }),
  });

  const result = await response.json();
  return { ok: response.ok, result };
};
