import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api.js";
import { MOCK_COMPANY, MOCK_PROFILE, MOCK_CHATBOT } from "../lib/mockData";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [company, setCompany] = useState(MOCK_COMPANY);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [chatbot, setChatbot] = useState({});

  // ─── FETCH ORDERS USER dari backend ─────────────────────────────────────────
  const fetchUserOrders = useCallback(async () => {
    const token = localStorage.getItem("mpl_token");
    if (!token) return;
    setOrdersLoading(true);
    try {
      // Endpoint ini akan mengambil semua pesanan dari backend (termasuk yang diverifikasi)
      const res = await api.get("/order/view");
      const data = res.data?.data || res.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("fetchUserOrders gagal:", err?.message);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // ─── FETCH COMPANY PROFILE ───────────────────────────────────────────────────
  const fetchCompany = useCallback(async () => {
    setCompanyLoading(true);
    try {
      const token = localStorage.getItem("mpl_token");
      const res = token
        ? await api.get("/user/companyprofile").catch(() => api.get("/user/admin/companyprofile"))
        : await api.get("/user/companyprofile");
      const raw = res.data?.data || res.data;
      if (raw) {
        setCompany(prev => ({
          ...prev,
          headline1: raw.headlineBaris1 || prev.headline1,
          headline2: raw.headlineBaris2 || prev.headline2,
          headline3: raw.headlineBaris3 || prev.headline3,
          tagline: raw.tagline || prev.tagline,
          ctaText: raw.teksTombolCTA || prev.ctaText,
          stat1: raw.angkaStatistik1 || prev.stat1,
          statLabel1: raw.labelStatistik1 || prev.statLabel1,
          stat2: raw.angkaStatistik2 || prev.stat2,
          statLabel2: raw.labelStatistik2 || prev.statLabel2,
          badgeText: raw.teksBadge || prev.badgeText,
          imgUrl: raw.urlGambarManual || raw.urlGambarOtomatis || prev.imgUrl,
          altText: raw.altText || prev.altText,
          judulSeksiSiapaKami: raw.judulSeksiSiapaKami || prev.judulSeksiSiapaKami,
          paragrafUtama: raw.paragrafUtama || prev.paragrafUtama,
          paragrafLanjutan: raw.paragrafLanjutan || prev.paragrafLanjutan,
          infoKilat: raw.infoKilat || prev.infoKilat,
          judulVisi: raw.judulVisi || prev.judulVisi,
          judulMisi: raw.judulMisi || prev.judulMisi,
          poinVisi: raw.poinVisi || prev.poinVisi,
          poinMisi: raw.poinMisi || prev.poinMisi,
          judulSeksiNilai: raw.judulSeksiNilai || prev.judulSeksiNilai,
          nilai: raw.nilai || prev.nilai,
          judulSeksiLayanan: raw.judulSeksiLayanan || prev.judulSeksiLayanan,
          layanan: raw.layanan || prev.layanan,
          judulSeksiKendaraan: raw.judulSeksiKendaraan || prev.judulSeksiKendaraan,
          kendaraan: raw.kendaraan || prev.kendaraan,
        }));
      }
    } catch (err) {
      console.warn("fetchCompany gagal, pakai mock:", err?.message);
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  // Fetch pesanan user saat pertama load jika sudah login dan auto-refresh tiap 15 detik
  useEffect(() => {
    const token = localStorage.getItem("mpl_token");
    if (!token) return;
    fetchUserOrders();
    const interval = setInterval(fetchUserOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchUserOrders]);

  const updateOrder = (id, patch) =>
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));

  const resetData = () => {
    setOrders([]);
    setCompany(MOCK_COMPANY);
    setProfile({});
    setChatbot({});
  };

  return (
    <DataContext.Provider
      value={{
        orders,
        ordersLoading,
        company,
        companyLoading,
        profile,
        chatbot,
        setOrders,
        setCompany,
        setProfile,
        setChatbot,
        updateOrder,
        resetData,
        fetchCompany,
        fetchUserOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};