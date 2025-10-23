const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const getOrgs    = () => api("/organizations");
export const createUser = (body) => api("/users", { method: "POST", body: JSON.stringify(body) });
export const getMe      = (userId) => api(`/users/me?userId=${userId}`);
export const updateUser = (id, body) => api(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) });

export const listPosts  = (q = "") => api(`/posts${q}`);
export const createPost = (body) => api("/posts", { method: "POST", body: JSON.stringify(body) });
export const deletePost = (id, authorId) => api(`/posts/${id}?authorId=${authorId}`, { method: "DELETE" });
