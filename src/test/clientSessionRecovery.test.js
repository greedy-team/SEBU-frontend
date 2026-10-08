import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError } from "axios";

let client;
let authApi;
let authStore;
let requests;

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};

function response(config, data = { success: true }, status = 200) {
  return { config, data, status, statusText: "", headers: {} };
}

function reject(config, code = "ACCESS_TOKEN_INVALID", status = 401) {
  return Promise.reject(new AxiosError(
    code, "ERR_BAD_RESPONSE", config, null,
    response(config, { success: false, error: { code } }, status),
  ));
}

function respond(handler) {
  client.defaults.adapter = (config) => {
    requests.push(`${config.method} ${config.url}`);
    return Promise.resolve().then(() => handler(config));
  };
}

beforeEach(async () => {
  vi.resetModules();
  ({ default: client } = await import("../api/client"));
  authApi = await import("../features/auth/api/authApi");
  ({ useAuthStore: authStore } = await import("../store/authStore"));
  requests = [];
});

describe("public reads after an API server change", () => {
  it.each([
    "/laboratories", "/colleges", "/research-field-categories",
    "/laboratories/622/reviews?page=0", "/laboratories/622/review-summary",
    "/posts?sort=LATEST", "/posts/1", "/posts/1/comments?page=0",
    "/users/1/community-profile",
  ])("clears invalid cookies and retries %s once", async (path) => {
    let invalidCookie = true;
    respond((config) => {
      if (config.url === "/auth/logout") invalidCookie = false;
      if (config.url === path && invalidCookie) return reject(config);
      return response(config);
    });
    await expect(client.get(path)).resolves.toMatchObject({ status: 200 });
    expect(requests).toEqual([
      `get ${path}`, "get /auth/csrf", "post /auth/logout", `get ${path}`,
    ]);
    expect(authStore.getState().status).toBe("anonymous");
  });

  it("shares cleanup across concurrent reads, including a late 401", async () => {
    const late = deferred();
    let labReads = 0;
    let collegeReads = 0;
    respond(async (config) => {
      if (config.url === "/laboratories" && labReads++ === 0) return reject(config);
      if (config.url === "/colleges" && collegeReads++ === 0) {
        await late.promise;
        return reject(config);
      }
      return response(config);
    });
    const labs = client.get("/laboratories");
    const colleges = client.get("/colleges");
    await labs;
    late.resolve();
    await colleges;
    expect(requests.filter((path) => path === "post /auth/logout")).toHaveLength(1);
    expect(labReads).toBe(2);
    expect(collegeReads).toBe(2);
  });

  it("joins a cleanup that is still in flight", async () => {
    const releaseLogout = deferred();
    let reset = false;
    respond(async (config) => {
      if (config.url === "/auth/logout") {
        await releaseLogout.promise;
        reset = true;
      }
      if (["/laboratories", "/colleges"].includes(config.url) && !reset) return reject(config);
      return response(config);
    });
    const reads = Promise.all([client.get("/laboratories"), client.get("/colleges")]);
    await vi.waitFor(() => expect(requests).toContain("post /auth/logout"));
    releaseLogout.resolve();
    await reads;
    expect(requests.filter((path) => path === "post /auth/logout")).toHaveLength(1);
  });

  it.each([
    ["get", "/me"], ["get", "/users/me/mypage"],
    ["get", "/users/me/bookmarked-laboratories"],
    ["put", "/laboratories/1/bookmark"], ["delete", "/laboratories/1/bookmark"],
    ["post", "/laboratories/1/reviews"], ["post", "/posts"],
    ["get", "https://other.example/laboratories"],
  ])("never resets or replays protected/unsafe request %s %s", async (method, url) => {
    respond((config) => reject(config));
    await expect(client({ method, url })).rejects.toMatchObject({ response: { status: 401 } });
    expect(requests).toEqual([`${method} ${url}`]);
  });

  it.each(["/auth/sejong/login", "/auth/refresh", "/auth/logout", "/auth/recovery"])(
    "does not retry an authentication failure at %s", async (url) => {
      respond((config) => reject(config, "SEJONG_AUTH_FAILED"));
      await expect(client.post(url)).rejects.toMatchObject({ response: { status: 401 } });
      expect(requests).toEqual([`post ${url}`]);
    },
  );

  it("stops if logout fails", async () => {
    respond((config) => config.url === "/auth/csrf" ? response(config) : reject(config));
    await expect(client.get("/laboratories")).rejects.toMatchObject({ response: { status: 401 } });
    expect(requests).toEqual(["get /laboratories", "get /auth/csrf", "post /auth/logout"]);
  });

  it("does not start another reset from the college API wrapper", async () => {
    const { fetchColleges } = await import("../features/main/api/mainApi");
    respond((config) => config.url === "/auth/csrf" ? response(config) : reject(config));
    await expect(fetchColleges()).rejects.toMatchObject({ response: { status: 401 } });
    expect(requests).toEqual(["get /colleges", "get /auth/csrf", "post /auth/logout"]);
  });

  it("does not reset again when the retry is still unauthorized", async () => {
    respond((config) => config.url === "/laboratories" ? reject(config) : response(config));
    await expect(client.get("/laboratories")).rejects.toMatchObject({ response: { status: 401 } });
    expect(requests.filter((path) => path === "get /laboratories")).toHaveLength(2);
    expect(requests.filter((path) => path === "post /auth/logout")).toHaveLength(1);
  });

  it("renews CSRF once if cookie reset receives a stale CSRF error", async () => {
    let logoutAttempts = 0;
    let reset = false;
    respond((config) => {
      if (config.url === "/laboratories" && !reset) return reject(config);
      if (config.url === "/auth/logout") {
        if (logoutAttempts++ === 0) return reject(config, "CSRF_TOKEN_INVALID", 403);
        reset = true;
      }
      return response(config);
    });
    await client.get("/laboratories");
    expect(requests).toEqual([
      "get /laboratories", "get /auth/csrf", "post /auth/logout",
      "get /auth/csrf", "post /auth/logout", "get /laboratories",
    ]);
  });
});

describe("session recovery and concurrent authentication", () => {
  it.each(["login", "refresh"])("preserves an in-flight %s that replaces the invalid cookie", async (kind) => {
    const auth = deferred();
    let reads = 0;
    respond(async (config) => {
      if (config.url === "/auth/sejong/login" || config.url === "/auth/refresh") {
        await auth.promise;
      }
      if (config.url === "/laboratories" && reads++ === 0) return reject(config);
      return response(config);
    });
    const mutation = kind === "login"
      ? authApi.sejongLogin("test", "test") : authApi.refreshToken();
    await vi.waitFor(() => expect(requests).toHaveLength(1));
    const read = client.get("/laboratories");
    await vi.waitFor(() => expect(requests).toHaveLength(2));
    auth.resolve();
    await mutation;
    await read;
    expect(requests).not.toContain("post /auth/logout");
    expect(reads).toBe(2);
  });

  it("ignores an old 401 arriving after a new login succeeds", async () => {
    const oldRead = deferred();
    let reads = 0;
    respond(async (config) => {
      if (config.url === "/laboratories" && reads++ === 0) {
        await oldRead.promise;
        return reject(config);
      }
      return response(config);
    });
    const read = client.get("/laboratories");
    await vi.waitFor(() => expect(requests).toHaveLength(1));
    await authApi.sejongLogin("test", "test");
    authStore.getState().setAuth({ id: 42 });
    oldRead.resolve();
    await read;
    expect(requests).not.toContain("post /auth/logout");
    expect(authStore.getState().user).toEqual({ id: 42 });
  });

  it("finishes a pending reset before sending a new login", async () => {
    const logout = deferred();
    let reads = 0;
    respond(async (config) => {
      if (config.url === "/auth/logout") await logout.promise;
      if (config.url === "/laboratories" && reads++ === 0) return reject(config);
      return response(config);
    });
    const read = client.get("/laboratories");
    await vi.waitFor(() => expect(requests).toContain("post /auth/logout"));
    const login = authApi.sejongLogin("test", "test");
    await Promise.resolve();
    expect(requests).not.toContain("post /auth/sejong/login");
    logout.resolve();
    await Promise.all([read, login]);
    expect(requests.indexOf("post /auth/sejong/login")).toBeGreaterThan(requests.indexOf("post /auth/logout"));
  });

  it("continues the auth queue after an invalid refresh from startup restoration", async () => {
    respond((config) => config.url === "/auth/refresh"
      ? reject(config, "REFRESH_TOKEN_INVALID") : response(config));
    await expect(authApi.refreshToken()).resolves.toMatchObject({ ok: false });
    await expect(authApi.sejongLogin("test", "test")).resolves.toMatchObject({ ok: true });
    expect(requests).toEqual(["post /auth/refresh", "post /auth/sejong/login"]);
  });
});
