import axios from "axios";

// Backend URL placeholder — wire backend later by replacing mock calls.
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://rosa15-silogismpl-backend.hf.space";
export const API = `${BACKEND_URL}`;

export const api = axios.create({ baseURL: API });

// Attach JWT token automatically (ready for real backend).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mpl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
