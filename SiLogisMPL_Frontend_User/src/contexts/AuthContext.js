import React, { createContext, useState, useContext, useEffect } from 'react';
// 1. Pastikan jalur import 'api' ini sesuai dengan lokasi file konfigurasi Axios kamu
import { api } from '../lib/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek sesi login saat halaman di-refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('mpl_user');
    const token = localStorage.getItem('mpl_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ========================================================
  // FUNGSI LOGIN: Menembak Server Hugging Face
  // ========================================================
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const rawStringData = response.data?.data || '';

      let token = '';
      if (rawStringData && rawStringData.includes('ini tokennya = ')) {
        token = rawStringData.split('ini tokennya = ')[1].trim();
      } else if (typeof rawStringData === 'string' && rawStringData.startsWith('eyJ')) {
        token = rawStringData;
      }

      if (!token) {
        return { success: false, ok: false, message: 'Login gagal: token tidak diterima' };
      }

      // Decode JWT payload untuk ambil role
      let userData = { email, role: 'USER' };
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userData = {
          email: payload.sub || email,
          name: payload.username || email,
          role: payload.role || 'USER',
        };
      } catch {}

      localStorage.setItem('mpl_token', token);
      localStorage.setItem('mpl_user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, ok: true };
    } catch (error) {
      console.error('Login Error:', error);
      const message = error.response?.data?.errors || error.response?.data?.message || 'Email atau password salah';
      return { success: false, ok: false, message };
    }
  };

  // ========================================================
  // FUNGSI REGISTER: Mengirim Data ke Server Hugging Face
  // ========================================================
  const register = async (name, email, password, confirmPassword) => {
    try {
      // Ini sudah mantap, tidak perlu diubah
      const response = await api.post('/auth/register', {
        username: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Register Error:", error);

      // BAGIAN INI YANG DIGANTI: Ambil dari error.response?.data?.errors terlebih dahulu
      const message = error.response?.data?.errors || error.response?.data?.message || 'Registrasi gagal, coba lagi nanti.';

      return { success: false, message };
    }
  };

  // ========================================================
  // FUNGSI LOGOUT
  // ========================================================
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mpl_token');
    localStorage.removeItem('mpl_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
