import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, CircleUser } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  // Menu disesuaikan dengan gambar
  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Pesanan', path: '/pesanan' },
    { name: 'Hubungi Kami', path: '/hubungi-kami' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-center h-20">
          
          {/* BAGIAN KIRI: Logo & Judul */}
          <Link to="/" className="flex items-center gap-4">
            {/* Ganti src dengan path file logo MPL-mu, misalnya '/logo-mpl.png' */}
            <div className="w-11 h-11 bg-black flex items-center justify-center overflow-hidden">
                <img src="/logo-mpl.jpg" alt="MPL Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight">
              MANDIRI PERKASA
            </h1>
          </Link>

          {/* BAGIAN TENGAH: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[15px] transition-colors relative py-1 ${
                  isActive(item.path)
                    ? 'text-[#F5BC00] font-bold'
                    : 'text-neutral-600 font-medium hover:text-[#111111]'
                }`}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
                {/* Garis bawah emas untuk menu yang aktif */}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F5BC00]" />
                )}
              </Link>
            ))}
          </div>

          {/* BAGIAN KANAN: Icons & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Icons */}
            <div className="flex items-center space-x-4 mr-2">

              <Link to="/profil" className="text-[#111111] hover:text-[#F5BC00] transition-colors">
                <CircleUser strokeWidth={2} className="w-7 h-7" />
              </Link>
            </div>

            {/* Tombol Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-neutral-800">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 text-[13px] font-bold text-[#F5BC00] bg-[#111111] hover:bg-black transition-colors tracking-widest uppercase"
                  data-testid="logout-button"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                to="/masuk"
                className="px-6 py-3 text-[12px] font-bold text-[#F5BC00] bg-[#111111] hover:bg-neutral-800 transition-colors tracking-widest uppercase"
                data-testid="masuk-daftar-button"
              >
                MASUK/DAFTAR
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#111111] hover:text-[#F5BC00]"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  isActive(item.path)
                    ? 'text-[#F5BC00] font-bold'
                    : 'text-neutral-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <div className="flex items-center space-x-4 py-2">

                <Link to="/profil" onClick={() => setMobileMenuOpen(false)}>
                  <CircleUser strokeWidth={2} className="w-6 h-6 text-[#111111] hover:text-[#F5BC00]" />
                </Link>
              </div>
              {user ? (
                <>
                  <div className="text-sm font-bold text-neutral-800 py-2">{user.name}</div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 text-[13px] font-bold text-[#F5BC00] bg-[#111111] tracking-widest uppercase text-center"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  to="/masuk"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-[13px] font-bold text-[#F5BC00] bg-[#111111] tracking-widest uppercase text-center"
                >
                  MASUK/DAFTAR
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;