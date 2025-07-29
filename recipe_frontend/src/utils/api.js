/**
 * API helper for communicating with the backend.
 * Change BASE_URL as needed (assumes backend runs on /api or localhost:8000 in dev).
 */
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "/api" || // For production with proxy
  "http://localhost:8000"; // fallback dev

function apiFetch(endpoint, opts = {}) {
  return fetch(BASE_URL + endpoint, opts).then(async (r) => {
    if (!r.ok) {
      let msg = "API error";
      try {
        const data = await r.json();
        if (data.detail) msg = data.detail;
        if (typeof data === "string") msg = data;
      } catch {
        msg = r.status + " " + r.statusText;
      }
      throw new Error(msg);
    }
    return r.status === 204 ? null : r.json();
  });
}

/* ==== Auth ==== */
export async function login(email, password) {
  // FastAPI expects x-www-form-urlencoded
  const params = new URLSearchParams({
    username: email,
    password,
  });
  const resp = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  return resp;
}

export async function register(email, password, full_name = "") {
  const resp = await apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name }),
  });
  return resp;
}

/* ==== User ==== */
export async function getMe(token) {
  const resp = await apiFetch("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp;
}

/* ==== Recipes ==== */
export async function listRecipes({ q = "", tag = "", ingredient = "", skip = 0, limit = 20 } = {}) {
  const params = [];
  if (q) params.push(`q=${encodeURIComponent(q)}`);
  if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
  if (ingredient) params.push(`ingredient=${encodeURIComponent(ingredient)}`);
  if (skip) params.push(`skip=${skip}`);
  if (limit !== undefined) params.push(`limit=${limit}`);
  const url = "/recipes/?" + params.join("&");
  return apiFetch(url);
}

export async function getRecipe(id) {
  return apiFetch(`/recipes/${id}`);
}

export async function createRecipe(token, recipe) {
  return apiFetch("/recipes/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });
}

export async function updateRecipe(token, id, recipe) {
  return apiFetch(`/recipes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });
}

export async function deleteRecipe(token, id) {
  return apiFetch(`/recipes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/* ==== My Recipes ==== */
export async function myRecipes(token) {
  // Backend does not have a specific 'my' recipes endpoint; filter client-side by owner_id.
  const recipes = await listRecipes({ limit: 200 }); // Fetch enough
  const user = await getMe(token);
  return recipes.filter((r) => r.owner_id === user.id);
}

/* ==== Bookmarks ==== */
export async function listBookmarks(token) {
  return apiFetch("/bookmarks/", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function bookmarkRecipe(token, recipe_id) {
  return apiFetch("/bookmarks/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipe_id }),
  });
}

export async function unbookmarkRecipe(token, recipe_id) {
  return apiFetch(`/bookmarks/${recipe_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
