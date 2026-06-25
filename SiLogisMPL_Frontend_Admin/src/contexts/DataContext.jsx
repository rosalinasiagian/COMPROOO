import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api.js";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardAndOrdersData = async () => {
      setOrdersLoading(true);
      try {
        const profileRes = await api.get("/user/admin/profile");
        const profileData = profileRes.data?.data || profileRes.data;

        if (profileData) {
          const mappedProfile = {
            name: profileData.username || "",
            email: profileData.email || "",
            role: profileData.role || "ADMIN",
            noTelepon: profileData.adminProfile?.noTelepon || "",
            avatarUrl: profileData.adminProfile?.urlProfilePicture || ""
          };
          setProfile(mappedProfile);

          const company = profileData.companyProfile;
          if (company) {
            setDashboardStats({
              pendingOrders: company.pendingOrders ?? null,
              ongoingOrders: company.ongoingOrders ?? null,
              angkaStatistik1: company.angkaStatistik1,
              angkaStatistik2: company.angkaStatistik2,
              labelStatistik1: company.labelStatistik1,
              labelStatistik2: company.labelStatistik2,
            });
          }
        }

        // Ganti endpoint ini sesuai dengan @GetMapping list orders di Spring Boot kamu
        const ordersRes = await api.get("/order/");
        const ordersData = ordersRes.data?.data || ordersRes.data;

        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else if (ordersData?.content && Array.isArray(ordersData.content)) {
          setOrders(ordersData.content);
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data API ke Dashboard:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchDashboardAndOrdersData();
  }, []);

  return (
    <DataContext.Provider value={{ profile, setProfile, orders, setOrders, dashboardStats, setDashboardStats, ordersLoading, setOrdersLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}