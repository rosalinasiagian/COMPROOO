import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Beranda from './pages/Beranda';
import Layanan from './pages/Layanan';
import HubungiKami from './pages/HubungiKami';
import Testimoni from './pages/Testimoni';
import Pesanan from './pages/Pesanan';
import Login from './pages/Login';
import Register from './pages/Register';
import LupaPassword from './pages/LupaPassword';
import Profil from './pages/Profil';
import Notifikasi from './pages/Notifikasi';
import { NotificationProvider } from './contexts/NotificationContext';
import '@/App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-8 h-8 border-4 border-[#F5BC00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Disinkronkan ke "/masuk" sesuai komponen Layout kamu
    return <Navigate to="/masuk" replace />;
  }
  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  // Menyembunyikan Navbar/Footer di halaman auth
  const hideNavbar = ['/masuk', '/daftar', '/lupa-password'].includes(location.pathname);
  const hideFooter = ['/masuk', '/daftar', '/lupa-password'].includes(location.pathname);

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <div className={!hideNavbar ? "pt-16" : ""}>
        {children}
      </div>
      {!hideFooter && <Footer />}
      <Toaster position="top-right" richColors />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
        {/* Urutan digeser: NotificationProvider sekarang bisa aman mengonsumsi data dari AuthProvider */}
        <NotificationProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Beranda />} />
              <Route path="/layanan" element={<Layanan />} />
              <Route path="/hubungi-kami" element={<HubungiKami />} />
              <Route path="/testimoni" element={<Testimoni />} />

              {/* Rute Terproteksi */}
              <Route
                path="/pesanan"
                element={
                  <ProtectedRoute>
                    <Pesanan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profil"
                element={
                  <ProtectedRoute>
                    <Profil />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifikasi"
                element={
                  <ProtectedRoute>
                    <Notifikasi />
                  </ProtectedRoute>
                }
              />

              {/* Rute Autentikasi */}
              <Route path="/masuk" element={<Login />} />
              <Route path="/daftar" element={<Register />} />
              <Route path="/lupa-password" element={<LupaPassword />} />
            </Routes>
          </Layout>
        </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;