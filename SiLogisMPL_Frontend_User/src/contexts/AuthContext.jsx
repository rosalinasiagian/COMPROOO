import { createContext, useContext, useEffect, useState } from "react";
// Import instance 'api' dari utils kamu yang menembak Hugging Face
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil session saat pertama kali app di-refresh
  useEffect(() => {
    const token = localStorage.getItem("mpl_token");
    const stored = localStorage.getItem("mpl_user");
    if (token && stored) {
      setUserState(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const setUser = (updater) => {
    setUserState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next) {
        localStorage.setItem("mpl_user", JSON.stringify(next));
      } else {
        localStorage.removeItem("mpl_user");
      }
      return next;
    });
  };

  // ========================================================
  // FUNGSI LOGIN: Terintegrasi dengan Backend Hugging Face
  // ========================================================
  const login = async (email, password) => {
    try {
      // Mengirim email & password ke endpoint login backend
      const response = await api.post('/auth/login', { email, password });

      // Mengambil data token dan profile user dari response backend
      const { token, user: userData } = response.data;

      localStorage.setItem("mpl_token", token);
      localStorage.setItem("mpl_user", JSON.stringify(userData));

      setUserState(userData);
      return { ok: true, success: true }; // 'ok' untuk dashboard admin, 'success' untuk login user biasa
    } catch (error) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Email atau password salah";
      return { ok: false, success: false, message };
    }
  };

  // ========================================================
  // FUNGSI REGISTER: Mengikuti kontrak data Postman kamu kemarin
  // ========================================================
  const register = async (username, email, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
        confirmPassword
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Register Error:", error);
      const message = error.response?.data?.message || "Registrasi gagal, coba lagi nanti.";
      return { success: false, message };
    }
  };

  // ========================================================
  // FUNGSI LOGOUT
  // ========================================================
  const logout = () => {
    localStorage.removeItem("mpl_token");
    localStorage.removeItem("mpl_user");
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};