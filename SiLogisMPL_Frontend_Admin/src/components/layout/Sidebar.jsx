import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, ListOrdered, Truck, Briefcase, User, LogOut, MessageSquare } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const NAV = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard", testid: "nav-dashboard" },
  { to: "/pesanan", icon: ListOrdered, label: "Pesanan", testid: "nav-pesanan" },
  { to: "/status-pengiriman", icon: Truck, label: "Status Pengiriman", testid: "nav-status" },
  { to: "/ulasan", icon: MessageSquare, label: "Ulasan", testid: "nav-ulasan" },
  { to: "/profil-perusahaan", icon: Briefcase, label: "Profil Perusahaan", testid: "nav-profil-perusahaan" },
  { to: "/profil", icon: User, label: "Profil", testid: "nav-profil" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isProfilPerusahaan = location.pathname === "/profil-perusahaan";
  const shouldHide = isProfilPerusahaan && !isHovered;

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <>
      {/* Invisible hover trigger zone when sidebar is hidden */}
      {isProfilPerusahaan && (
        <div 
          className="fixed top-0 left-0 w-6 h-screen z-40"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <aside 
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-white border-r border-gray-200/70 flex flex-col h-screen top-0 transition-all duration-300 z-50 ${
          isProfilPerusahaan ? 'fixed left-0 shadow-2xl' : 'sticky w-[260px]'
        } ${shouldHide ? '-translate-x-full' : 'translate-x-0'} ${
          isProfilPerusahaan && !shouldHide ? 'w-[260px]' : ''
        }`}
        style={{ width: isProfilPerusahaan ? '260px' : undefined }}
      >
        <div className="px-7 pt-7 pb-5">
          <div className="mb-4">
            <img src="/logo.jpg" alt="CV. Mandiri Perkasa Logistik" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-[18px] font-bold text-gray-900 leading-tight">Panel Admin</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Logistics Controller</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {NAV.map(({ to, icon: Icon, label, testid }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={testid}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#FFA000] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 rounded-lg bg-[#FFA000] text-white font-bold flex items-center justify-center">
              {user?.name?.[0] || "Z"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-gray-900 truncate">{user?.name || "Zuhri"}</div>
              <div className="text-[10px] text-gray-400 tracking-wider uppercase">{user?.role || "Senior Dispatcher"}</div>
            </div>
            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}