import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataPesanan from "./pages/DataPesanan";
import DetailVerifikasi from "./pages/DetailVerifikasi";
import StatusPengiriman from "./pages/StatusPengiriman";
import UpInvoice from "./pages/UpInvoice";
import ProfilPerusahaan from "./pages/ProfilPerusahaan";
import Profil from "./pages/Profil";
import Ulasan from "./pages/Ulasan";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* PUBLIC */}
              <Route path="/login" element={<Login />} />

              {/* PROTECTED */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pesanan" element={<DataPesanan />} />
                  <Route path="/pesanan/:id/verifikasi" element={<DetailVerifikasi />} />
                  <Route path="/status-pengiriman" element={<StatusPengiriman />} />
                  <Route path="/invoice/:id" element={<UpInvoice />} />
                  <Route path="/ulasan" element={<Ulasan />} />
                  <Route path="/profil-perusahaan" element={<ProfilPerusahaan />} />
                  <Route path="/profil" element={<Profil />} />
                </Route>
              </Route>

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;