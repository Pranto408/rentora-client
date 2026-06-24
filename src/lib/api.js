// lib/api.js  (in your Next.js project)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Call this right after BetterAuth login/register
export async function getJWT(email) {
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
}

// Use this for every API call that needs auth
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("rentora_token");
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return res.json();
}
