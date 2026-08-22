import axios from "axios";

// Vite only exposes env vars prefixed with VITE_ to browser code — this is
// a deliberate security boundary (anything without that prefix stays
// server-side-only / build-tool-only and never ships to the client bundle).
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  // Fails loudly at dev-time rather than silently sending requests to
  // "undefined/api/..." which is a confusing bug to debug later.
  throw new Error("VITE_API_URL is not set. Check your client/.env file.");
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attaches the JWT (if we have one) to every outgoing request automatically,
// so individual API calls don't need to remember to do this themselves.
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// ---- Auth ----
export function login(email, password) {
  return api.post("/api/auth/login", { email, password }).then((res) => res.data);
}

export function register(name, email, password) {
  return api.post("/api/auth/register", { name, email, password }).then((res) => res.data);
}

// ---- Movies ----
export function getMovies(params) {
  return api.get("/api/movies", { params }).then((res) => res.data);
}

export function createMovie(movie) {
  return api.post("/api/movies", movie).then((res) => res.data);
}

export function updateMovie(id, updates) {
  return api.patch(`/api/movies/${id}`, updates).then((res) => res.data);
}

export function deleteMovie(id) {
  return api.delete(`/api/movies/${id}`).then((res) => res.data);
}

export default api;
