const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Get JWT from Express backend after BetterAuth login/register ─────────────
export async function getJWT(email) {
  try {
    const res = await fetch(`${API_URL}/api/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("rentora_token", data.token);
    }
    return data.token;
  } catch (err) {
    console.error("getJWT failed:", err);
    return null;
  }
}

// ─── Clear JWT on logout ───────────────────────────────────────────────────────
export function clearJWT() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("rentora_token");
  }
}

// ─── Get stored JWT ────────────────────────────────────────────────────────────
export function getStoredToken() {
  if (typeof window === "undefined") return null; // SSR safety
  return localStorage.getItem("rentora_token");
}

// ─── Main fetch helper — always use this to call Express backend ───────────────
export async function apiFetch(endpoint, options = {}) {
  try {
    const token = getStoredToken();

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    // If 401, token is expired — clear it
    if (res.status === 401) {
      clearJWT();
      window.location.href = "/login";
      return null;
    }

    return res.json();
  } catch (err) {
    console.error(`apiFetch error [${endpoint}]:`, err);
    throw err;
  }
}
